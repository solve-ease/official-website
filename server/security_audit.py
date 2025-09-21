#!/usr/bin/env python3
"""
Security Audit Script for Career Application API

This script checks for common security issues before deployment.
Run this before deploying to production.
"""

import os
import sys
import re
from pathlib import Path

class SecurityAuditor:
    def __init__(self, server_path):
        self.server_path = Path(server_path)
        self.issues = []
        self.warnings = []
        
    def add_issue(self, severity, file_path, line, issue, recommendation):
        """Add a security issue to the report."""
        self.issues.append({
            'severity': severity,
            'file': str(file_path),
            'line': line,
            'issue': issue,
            'recommendation': recommendation
        })
    
    def add_warning(self, file_path, line, warning, recommendation):
        """Add a security warning to the report."""
        self.warnings.append({
            'file': str(file_path),
            'line': line,
            'warning': warning,
            'recommendation': recommendation
        })
    
    def check_hardcoded_secrets(self):
        """Check for hardcoded secrets, API keys, passwords."""
        print("🔍 Checking for hardcoded secrets...")
        
        patterns = [
            (r'password\s*=\s*[\'"][^\'"]+[\'"]', 'Hardcoded password'),
            (r'secret\s*=\s*[\'"][^\'"]+[\'"]', 'Hardcoded secret'),
            (r'api_?key\s*=\s*[\'"][^\'"]+[\'"]', 'Hardcoded API key'),
            (r'token\s*=\s*[\'"][^\'"]+[\'"]', 'Hardcoded token'),
            (r'your-secure-api-key', 'Default API key'),
            (r'dev-secret-key', 'Development secret key'),
            (r'sk-[a-zA-Z0-9]{20,}', 'OpenAI API key pattern'),
            (r'[0-9a-f]{32}', 'Possible MD5 hash or API key'),
        ]
        
        for py_file in self.server_path.rglob("*.py"):
            try:
                with open(py_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines, 1):
                    # Skip comments and documentation
                    if line.strip().startswith('#') or '"""' in line or "'''" in line:
                        continue
                    
                    for pattern, description in patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            self.add_issue(
                                'HIGH',
                                py_file.relative_to(self.server_path),
                                i,
                                f"{description}: {line.strip()}",
                                "Move to environment variables"
                            )
            except Exception as e:
                print(f"Error reading {py_file}: {e}")
    
    def check_environment_variables(self):
        """Check if required environment variables are set."""
        print("🔍 Checking environment variables...")
        
        required_vars = [
            'SECRET_KEY',
            'API_KEY', 
            'SUPABASE_URL',
            'SUPABASE_KEY'
        ]
        
        for var in required_vars:
            if not os.environ.get(var):
                self.add_issue(
                    'CRITICAL',
                    'environment',
                    0,
                    f"Missing required environment variable: {var}",
                    f"Set {var} in your environment or .env file"
                )
    
    def check_debug_mode(self):
        """Check if debug mode is disabled in production."""
        print("🔍 Checking debug configuration...")
        
        config_file = self.server_path / "config.py"
        if config_file.exists():
            with open(config_file, 'r') as f:
                content = f.read()
                
            if 'DEBUG = True' in content and 'ProductionConfig' in content:
                # This is okay if it's only in DevelopmentConfig
                lines = content.split('\n')
                in_production_class = False
                
                for i, line in enumerate(lines, 1):
                    if 'class ProductionConfig' in line:
                        in_production_class = True
                    elif line.startswith('class ') and 'ProductionConfig' not in line:
                        in_production_class = False
                    elif in_production_class and 'DEBUG = True' in line:
                        self.add_issue(
                            'HIGH',
                            'config.py',
                            i,
                            "Debug mode enabled in production configuration",
                            "Set DEBUG = False in ProductionConfig"
                        )
    
    def check_cors_configuration(self):
        """Check CORS configuration for security."""
        print("🔍 Checking CORS configuration...")
        
        for py_file in self.server_path.rglob("*.py"):
            try:
                with open(py_file, 'r') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines, 1):
                    if 'origins=' in line and ('*' in line or "'*'" in line or '"*"' in line):
                        self.add_issue(
                            'HIGH',
                            py_file.relative_to(self.server_path),
                            i,
                            "CORS allows all origins (*)",
                            "Restrict CORS to specific domains"
                        )
            except Exception as e:
                pass
    
    def check_sql_injection_risks(self):
        """Check for potential SQL injection vulnerabilities."""
        print("🔍 Checking for SQL injection risks...")
        
        dangerous_patterns = [
            r'\.execute\([\'"].*%.*[\'"]',
            r'\.execute\([\'"].*\+.*[\'"]',
            r'f[\'"].*\{.*\}.*[\'"].*execute',
            r'format\(.*\).*execute',
        ]
        
        for py_file in self.server_path.rglob("*.py"):
            try:
                with open(py_file, 'r') as f:
                    lines = f.readlines()
                
                for i, line in enumerate(lines, 1):
                    for pattern in dangerous_patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            self.add_warning(
                                py_file.relative_to(self.server_path),
                                i,
                                f"Potential SQL injection risk: {line.strip()}",
                                "Use parameterized queries or ORM methods"
                            )
            except Exception as e:
                pass
    
    def check_rate_limiting(self):
        """Check if rate limiting is properly implemented."""
        print("🔍 Checking rate limiting implementation...")
        
        found_rate_limiting = False
        for py_file in self.server_path.rglob("*.py"):
            try:
                with open(py_file, 'r') as f:
                    content = f.read()
                    if '@rate_limit' in content or 'rate_limit' in content:
                        found_rate_limiting = True
                        break
            except Exception:
                pass
        
        if not found_rate_limiting:
            self.add_warning(
                'general',
                0,
                "No rate limiting found",
                "Implement rate limiting on sensitive endpoints"
            )
    
    def generate_report(self):
        """Generate the security audit report."""
        print("\n" + "="*80)
        print("🛡️  SECURITY AUDIT REPORT")
        print("="*80)
        
        if not self.issues and not self.warnings:
            print("✅ No security issues found!")
            return True
        
        if self.issues:
            print(f"\n🚨 SECURITY ISSUES FOUND: {len(self.issues)}")
            print("-" * 50)
            
            for issue in sorted(self.issues, key=lambda x: {'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3}[x['severity']]):
                severity_icon = {'CRITICAL': '🔴', 'HIGH': '🟠', 'MEDIUM': '🟡', 'LOW': '🟢'}
                print(f"\n{severity_icon[issue['severity']]} {issue['severity']}: {issue['file']}:{issue['line']}")
                print(f"   Issue: {issue['issue']}")
                print(f"   Fix: {issue['recommendation']}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS: {len(self.warnings)}")
            print("-" * 30)
            
            for warning in self.warnings:
                print(f"\n🟡 {warning['file']}:{warning['line']}")
                print(f"   Warning: {warning['warning']}")
                print(f"   Recommendation: {warning['recommendation']}")
        
        print("\n" + "="*80)
        
        # Return False if there are critical or high severity issues
        critical_issues = [i for i in self.issues if i['severity'] in ['CRITICAL', 'HIGH']]
        return len(critical_issues) == 0

def main():
    script_dir = Path(__file__).parent
    server_path = script_dir
    
    print("🔐 Starting Security Audit for Career Application API")
    print(f"📁 Auditing: {server_path}")
    print("-" * 80)
    
    auditor = SecurityAuditor(server_path)
    
    # Run all security checks
    auditor.check_hardcoded_secrets()
    auditor.check_environment_variables() 
    auditor.check_debug_mode()
    auditor.check_cors_configuration()
    auditor.check_sql_injection_risks()
    auditor.check_rate_limiting()
    
    # Generate report
    is_secure = auditor.generate_report()
    
    if is_secure:
        print("✅ Security audit passed! Ready for deployment.")
        sys.exit(0)
    else:
        print("❌ Security audit failed! Fix issues before deployment.")
        sys.exit(1)

if __name__ == "__main__":
    main()
