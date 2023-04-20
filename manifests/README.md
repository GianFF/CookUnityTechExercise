# Architectural Decisions

## SPIKE 

There are different options for the Cloud with pros and cons:

* Lambda & API Gateway & DynamoDB.
  - Can use the [AWS Free Tier](https://aws.amazon.com/free/?p=gsrc&c=ho_bswa)
  - Lambda functions can be auto scaled in order to fulfill the demand.
  - Manage the infra as code is something I need to investigate (IAM roles, API Gateway, DynamoDB).

* Kubernetes with Docker & Docker Compose for the MongoDB and the Client API.
  - It is not cost-less to deploy in the Cloud so I would use a local kubernetes container.
  - The solution will need to have different resources like Load Balancer, Ingress, and others to fulfill the demand. Compared with Lambdas, it looks more complex.
  - All the infra can be written in YAML files and managed by devs easily.

* Pricing: 
  - TO BE DONE

* Deploy: 
  - Use Kubernetes locally with minikube to showcase the deploy to the cloud.
  - The idea was to update the Manifests Docker image tag on each commit to main, this chould be done on the CD-Workflow Github Action.
  - Once updated, the cluster could take that update and deploy the changes (using some observability mechanism on the manifests repository).

## K8s Architecture

API k8s objects:
* A Deployment with the API Docker Image, replicas and env vars.
  - the API Docker Image is been Built & Push to the registry on each commit to main. 
  - Image repo: https://hub.docker.com/repository/docker/edymberg/cookunity-traces/general
* A Service of type Load Balancer to route traffic from the outside of the cluster. 

DB k8s objects:
* A PersistentVolumeClaim to persist data even if the pod is restarted.
* A Service of type ClusterIP to route traffic from within the cluster.
* A Deployment to spin up the MongoDB instance using the MongoDB Docker Image.
  - this image creates the DB, user and initial collection.
  - Image repo: https://hub.docker.com/repository/docker/edymberg/cookunity-traces-db/general

### Deploy locally using minikube and k8s.

Create a minikube cluster:
* create local cluster `minikube start`
* lunch dashboard `minikube dashboard`

Deploy manifests to cluster: 
* deploy everything togheder `kubectl apply -f .`
* or one by one: `kubectl apply -f manifests/deployment.yaml`

Make resources available from the outside of the cluster:
* `minikube service cookunity-api-service`

Check logs:
* `kubectl logs {{pod-name}}`

Get into a Pod:
* `kubectl exec {{pod-name}} -it -- /bin/bash`
