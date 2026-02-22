
# Github Acation and deployment

## Deployment hosting services

### Database setup

For creating/hosting a database I went with Atlasdb. This was by far the easiest option because:
- they had easily scalable free plan. Since this is a just a test I didnt want to spend extra money, and thus the free plan with limited space was perfect
- Atlasdb is built with MongoDB in mind which is what was used with the in the project before deployment. Making it an easy and logical next step
- Avoids setting up/ making a database in the backend host, and keeps it as a completly seperate service. Meaning it is alot easier to debug problems
- Getting an URL worked directly with the project without any changes necessary (execpt the .env url) 
- Allows connection to the Database directly through the terminal

> this is the only part of the CI/CD that was not automated, we instead just give the url to the rest of the apps

## Backend setup

For backend hosting I went with Google Cloud Run:
- They have a great free tier, and is also easily scalable to bigger paid projects
- Is an industry standard, allowing me to learn and get practice using it
- Works with websockets, allowing the core functionality (the actual messaging) of the website to work
- Works incredibly well with containerized apps, which means it was easier to setup and upload

## Frontend setup

Netlify is used to deploy the frontend.
- Has a pretty good free tier option, with easy scalabilty. Although common to run out of free credits on constant deployment
- Much nicer url then other options 
- Intergrated CI/CD support
- Easy and simple deployment via github actions

![Cloud Service Diagram](images/Cloud%20Services%20Diagram.png)

## Github actions

![Github Action workflow](images/Action%20flow.png)


| Workflow File      | Purpose |
| -------------------| ---------------------------------------------------------------------------------------------------------------------- |
| pull_reminder.yml  |When pulling from main/master this sends a message to remind devs of the rules of pushing/merging to main|
| ci.yml| activates on every pull request or push that is not main/master. Runs both testing .yml | 
| cd.yml             | CD activates every time a Push is commited to main/master or when a Pull Request targets main/master. It allows all other workflow files to run, not running the next if errors occur|
| backend_tests.yml  | Runs off ci/cd, runs all tests for the backend with jsx printing a console log and making an artifact of said console (for storing + debugging)|
| frontend_tests.yml | Also runs off ci/cd. Runs all tests for frontend with vitest also printing to console and making another artifact|
| backend_cd.yml     | Will only run once both tests have been passed in CD, deploys the backend to google cloud services, sending all required github action secrets with it to inject into the deployed container|
| frontend_cd.yml    | Finally runs after all other parts have completed successfully. Deploys the frontend to Netlify, sending the url of the backend (updated via  github secrets) with it|





#
Project is currently deployed url https://msgblahblah.netlify.app