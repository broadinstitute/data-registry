from fabric import task


@task
def deploy(c, env, commit=None):
    """
    Deploy the application to the specified environment.

    Parameters:
        c: The connection context.
        env: The environment (e.g., 'dev', 'prod').
        commit: The commit to deploy. If not specified, the latest commit on main.
    """
    update_source(c, env, commit)
    build(c, env)


@task
def build(c, env):
    """
    Build the nuxt application
    """
    directory = get_checkout_directory(env)
    with c.cd(directory):
        c.run("npm install")
        c.run("npx browserslist@latest --update-db")
        c.run("rm -rf .output && rm -rf node_modules/.cache")
        c.run(f"rm -f .env && cp /home/ec2-user/env-files/dr-{env} .env")
        c.run("node_modules/.bin/nuxt generate")

@task
def update_source(c, env, commit=None):
    """
    Update the environment's source code to either the latest in main or a specified commit.
    """
    directory = get_checkout_directory(env)
    with c.cd(directory):
        if commit:
            c.run(f"git fetch && git checkout {commit}")
        else:
            c.run("git checkout main && git pull")



def get_checkout_directory(env):
    return f"/home/ec2-user/dr-frontend-{env}"


