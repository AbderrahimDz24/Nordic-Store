## Quick Start

Clone the project and open the terminal on the repo directory.

Build Docker Image:
```
docker build -t nordic-store-image . 
```

Run Docker Image:
```
docker run -p 3000:3000 --env UNSPLASH_ACCESS_KEY=<your_unsplach_access_key> --name nordic-store nordic-store-image
```

Open the browser on [localhost:3000](http://localhost:3000) 


## About

This repo was built as an assessment for a job post on Upwork.
Here is the [job description](JOB_DESCRIPTION.md).