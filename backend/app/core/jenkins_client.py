import jenkins

JENKINS_URL = 'http://localhost:8080'
JENKINS_USER = 'aditi'
JENKINS_PASS = '115e928194844e7e2891ad5eb335efc5d0'

def get_jenkins_server():
    # In a real scenario, credentials would be stored in .env
    server = jenkins.Jenkins(JENKINS_URL, username=JENKINS_USER, password=JENKINS_PASS)
    return server

def trigger_jenkins_job(project_name: str, branch: str = "main"):
    try:
        server = get_jenkins_server()
        # For simplicity in this local prototype, we assume Jenkins has jobs named after projects
        # We replace slashes since Jenkins job names typically don't have slashes 
        job_name = project_name.replace("/", "-")
        
        # Check if job exists, if not, we can't trigger it 
        if server.job_exists(job_name):
            try:
                server.build_job(job_name, parameters={'branch': branch})
            except Exception as inner_e:
                # Fallback for freestyle jobs that are not parameterized
                if "400 Client Error" in str(inner_e) or "404" in str(inner_e):
                    server.build_job(job_name)
                else:
                    raise inner_e
                    
            return True, f"Triggered {job_name}"
        else:
            return False, f"Job {job_name} not found in Jenkins"
    except Exception as e:
        err = str(e)
        if "401" in err:
            err = "Jenkins Authentication Failed (401)"
        print(f"Jenkins trigger failed: {err}")
        return False, err
