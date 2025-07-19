# #!/usr/bin/env python3
# """
# Git AI - AI-powered Git CLI tool
# Usage: git-ai "natural language command"
# """

import subprocess
import sys
import re
import os
from datetime import datetime
import json

class GitAI:
    def __init__(self):
        self.repo_path = self._find_git_repo()
        if not self.repo_path:
            print("Error: Not in a Git repository")
            sys.exit(1)
    
    def _find_git_repo(self):
        """Find the root of the Git repository"""
        current_dir = os.getcwd()
        while current_dir != '/':
            if os.path.exists(os.path.join(current_dir, '.git')):
                return current_dir
            current_dir = os.path.dirname(current_dir)
        return None
    
    def _run_git_command(self, command):
        """Execute a Git command and return the output"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=self.repo_path
            )
            return result.stdout, result.stderr, result.returncode
        except Exception as e:
            return "", str(e), 1
    
    def _parse_intent(self, user_input):
        """Parse user intent from natural language input"""
        input_lower = user_input.lower()
        
        # Commit patterns
        if any(word in input_lower for word in ['commit', 'save', 'record']):
            if any(word in input_lower for word in ['push', 'sync', 'upload', 'remote']):
                return 'commit_and_push', self._extract_commit_message(user_input)
            else:
                return 'commit', self._extract_commit_message(user_input)
        
        # Status patterns
        if any(word in input_lower for word in ['status', 'changes', 'modified', 'what changed']):
            return 'status', None
        
        # History patterns
        if any(word in input_lower for word in ['history', 'log', 'commits', 'last commit']):
            return 'log', self._extract_log_count(user_input)
        
        # File history patterns
        if 'where' in input_lower and any(word in input_lower for word in ['changed', 'modified', 'edited']):
            filename = self._extract_filename(user_input)
            return 'file_history', filename
        
        # Branch patterns
        if any(word in input_lower for word in ['branch', 'branches']):
            if 'create' in input_lower or 'new' in input_lower:
                branch_name = self._extract_branch_name(user_input)
                return 'create_branch', branch_name
            elif 'switch' in input_lower or 'checkout' in input_lower:
                branch_name = self._extract_branch_name(user_input)
                return 'switch_branch', branch_name
            else:
                return 'list_branches', None
        
        # Pull/fetch patterns
        if any(word in input_lower for word in ['pull', 'fetch', 'update', 'sync from']):
            return 'pull', None
        
        # Diff patterns
        if any(word in input_lower for word in ['diff', 'difference', 'compare']):
            return 'diff', None
        
        # Default fallback
        return 'unknown', user_input
    
    def _extract_commit_message(self, user_input):
        """Extract commit message from user input"""
        # Look for quoted strings first
        quoted_match = re.search(r'"([^"]+)"', user_input)
        if quoted_match:
            return quoted_match.group(1)
        
        # Remove common Git AI command words and use the rest
        words_to_remove = ['commit', 'save', 'record', 'changes', 'push', 'sync', 'with', 'message']
        words = user_input.split()
        filtered_words = [word for word in words if word.lower() not in words_to_remove]
        
        if filtered_words:
            return ' '.join(filtered_words)
        else:
            return f"Auto-commit: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    def _extract_filename(self, user_input):
        """Extract filename from user input"""
        # Look for file extensions
        file_pattern = r'\b\w+\.\w+\b'
        matches = re.findall(file_pattern, user_input)
        return matches[0] if matches else None
    
    def _extract_branch_name(self, user_input):
        """Extract branch name from user input"""
        words = user_input.split()
        for i, word in enumerate(words):
            if word.lower() in ['branch', 'to']:
                if i + 1 < len(words):
                    return words[i + 1]
        return None
    
    def _extract_log_count(self, user_input):
        """Extract number of commits to show from user input"""
        numbers = re.findall(r'\b(\d+)\b', user_input)
        return int(numbers[0]) if numbers else 10
    
    def execute_command(self, intent, data):
        """Execute the appropriate Git command based on intent"""
        if intent == 'commit':
            return self._handle_commit(data)
        elif intent == 'commit_and_push':
            return self._handle_commit_and_push(data)
        elif intent == 'status':
            return self._handle_status()
        elif intent == 'log':
            return self._handle_log(data)
        elif intent == 'file_history':
            return self._handle_file_history(data)
        elif intent == 'list_branches':
            return self._handle_list_branches()
        elif intent == 'create_branch':
            return self._handle_create_branch(data)
        elif intent == 'switch_branch':
            return self._handle_switch_branch(data)
        elif intent == 'pull':
            return self._handle_pull()
        elif intent == 'diff':
            return self._handle_diff()
        else:
            return self._handle_unknown(data)
    
    def _handle_commit(self, message):
        """Handle commit operation"""
        # First, add all changes
        stdout, stderr, code = self._run_git_command("git add .")
        if code != 0:
            return f"Error adding files: {stderr}"
        
        # Then commit
        stdout, stderr, code = self._run_git_command(f'git commit -m "{message}"')
        if code == 0:
            return f"✅ Successfully committed: {message}"
        else:
            return f"❌ Commit failed: {stderr}"
    
    def _handle_commit_and_push(self, message):
        """Handle commit and push operation"""
        # First commit
        commit_result = self._handle_commit(message)
        if "❌" in commit_result:
            return commit_result
        
        # Then push
        stdout, stderr, code = self._run_git_command("git push")
        if code == 0:
            return f"✅ Successfully committed and pushed: {message}"
        else:
            return f"✅ Committed but push failed: {stderr}"
    
    def _handle_status(self):
        """Handle status operation"""
        stdout, stderr, code = self._run_git_command("git status --porcelain")
        if code != 0:
            return f"❌ Error getting status: {stderr}"
        
        if not stdout.strip():
            return "✅ Working directory clean - no changes detected"
        
        result = "📊 Current repository status:\n"
        for line in stdout.strip().split('\n'):
            status = line[:2]
            filename = line[3:]
            if status == "??":
                result += f"  🆕 Untracked: {filename}\n"
            elif status[0] == "M":
                result += f"  ✏️  Modified: {filename}\n"
            elif status[0] == "A":
                result += f"  ➕ Added: {filename}\n"
            elif status[0] == "D":
                result += f"  ➖ Deleted: {filename}\n"
            else:
                result += f"  📝 {filename} ({status})\n"
        
        return result
    
    def _handle_log(self, count):
        """Handle log operation"""
        stdout, stderr, code = self._run_git_command(f"git log --oneline -n {count}")
        if code != 0:
            return f"❌ Error getting log: {stderr}"
        
        result = f"📜 Last {count} commits:\n"
        for line in stdout.strip().split('\n'):
            if line:
                result += f"  • {line}\n"
        
        return result
    
    def _handle_file_history(self, filename):
        """Handle file history operation"""
        if not filename:
            return "❌ Please specify a filename"
        
        stdout, stderr, code = self._run_git_command(f"git log --oneline -n 5 -- {filename}")
        if code != 0:
            return f"❌ Error getting file history: {stderr}"
        
        if not stdout.strip():
            return f"📁 No commit history found for {filename}"
        
        result = f"📁 Recent changes to {filename}:\n"
        for line in stdout.strip().split('\n'):
            if line:
                result += f"  • {line}\n"
        
        return result
    
    def _handle_list_branches(self):
        """Handle list branches operation"""
        stdout, stderr, code = self._run_git_command("git branch -a")
        if code != 0:
            return f"❌ Error listing branches: {stderr}"
        
        result = "🌿 Available branches:\n"
        for line in stdout.strip().split('\n'):
            if line:
                if line.startswith('*'):
                    result += f"  ➤ {line[2:]} (current)\n"
                else:
                    result += f"    {line.strip()}\n"
        
        return result
    
    def _handle_create_branch(self, branch_name):
        """Handle create branch operation"""
        if not branch_name:
            return "❌ Please specify a branch name"
        
        stdout, stderr, code = self._run_git_command(f"git checkout -b {branch_name}")
        if code == 0:
            return f"✅ Created and switched to branch: {branch_name}"
        else:
            return f"❌ Failed to create branch: {stderr}"
    
    def _handle_switch_branch(self, branch_name):
        """Handle switch branch operation"""
        if not branch_name:
            return "❌ Please specify a branch name"
        
        stdout, stderr, code = self._run_git_command(f"git checkout {branch_name}")
        if code == 0:
            return f"✅ Switched to branch: {branch_name}"
        else:
            return f"❌ Failed to switch branch: {stderr}"
    
    def _handle_pull(self):
        """Handle pull operation"""
        stdout, stderr, code = self._run_git_command("git pull")
        if code == 0:
            if "Already up to date" in stdout:
                return "✅ Repository is already up to date"
            else:
                return f"✅ Successfully pulled changes:\n{stdout}"
        else:
            return f"❌ Pull failed: {stderr}"
    
    def _handle_diff(self):
        """Handle diff operation"""
        stdout, stderr, code = self._run_git_command("git diff --stat")
        if code != 0:
            return f"❌ Error getting diff: {stderr}"
        
        if not stdout.strip():
            return "✅ No differences found"
        
        return f"📊 Changes summary:\n{stdout}"
    
    def _handle_unknown(self, user_input):
        """Handle unknown commands"""
        return f"""❓ I didn't understand: "{user_input}"

Here are some things you can try:
  • "commit changes with message 'fix bug'"
  • "commit and push with message 'add feature'"
  • "show status"
  • "show last 5 commits"
  • "where was index.html changed last time"
  • "list branches"
  • "create branch feature-xyz"
  • "switch to main branch"
  • "pull latest changes"
  • "show differences"
"""

def main():
    if len(sys.argv) != 2:
        print("Usage: git-ai \"your natural language command\"")
        print("Example: git-ai \"commit changes with message 'fix login bug'\"")
        sys.exit(1)
    
    user_command = sys.argv[1]
    git_ai = GitAI()
    
    # Parse the user's intent
    intent, data = git_ai._parse_intent(user_command)
    
    # Execute the command
    result = git_ai.execute_command(intent, data)
    print(result)

if __name__ == "__main__":
    main()