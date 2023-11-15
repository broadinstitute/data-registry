import subprocess
import re

# Function to get the latest tag from git
def get_latest_tag():
    try:
        # Get the latest tag from git
        tags = subprocess.check_output(['git', 'tag']).decode('utf-8').strip().split('\n')
        # Filter out empty and non-version tags
        version_tags = [tag for tag in tags if re.match(r'^V\d+\.\d+\.\d+$', tag)]
        if not version_tags:
            # If there are no version tags, start with version 0.0.0
            return 'V0.0.0'
        latest_tag = sorted(version_tags, key=lambda s: list(map(int, s.strip('V').split('.'))))[-1]
        return latest_tag
    except subprocess.CalledProcessError as e:
        # If git is not available, or there is no tags yet, start with version 0.0.0
        print("Error: ", e.output)
        return 'V0.0.0'

# Function to increment the version
def increment_version(version, release_type):
    major, minor, patch = map(int, version.strip('V').split('.'))
    if release_type == 'major':
        major += 1
        minor = 0
        patch = 0
    elif release_type == 'minor':
        minor += 1
        patch = 0
    elif release_type == 'patch':
        patch += 1
    else:
        raise ValueError("Invalid release type: choose 'major', 'minor', or 'patch'")
    return f'v{major}.{minor}.{patch}'

# Main script
if __name__ == "__main__":
    # Prompt the user for the type of release
    release_type = input("Enter the type of release (major, minor, patch): ").lower().strip()
    current_version = get_latest_tag()
    new_version = increment_version(current_version, release_type)

    print(f"The current version is: {current_version}")
    print(f"The new version will be: {new_version}")
