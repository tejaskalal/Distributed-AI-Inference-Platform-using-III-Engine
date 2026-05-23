# Distributed-AI-Inference-Platform-using-III-Engine
A distributed AI inference platform built using the III Engine, Terraform, Python, and TypeScript workers. The system deploys multiple RPC-connected workers across private cloud VMs, exposes model inference through a JSON HTTP API, and serves GGUF-based language model responses through a scalable multi-VM architecture.


# Distributed AI Inference Platform using III Engine

## Overview

This project demonstrates a production-style distributed AI inference architecture built using the III Engine, Terraform, Python workers, and TypeScript workers.

The system deploys multiple RPC-connected workers across private cloud VMs, exposes model inference through a JSON HTTP API, and serves GGUF-based language model responses through a scalable multi-VM architecture.

The project was implemented as part of a DevOps Internship Assignment.

---

# Architecture

```text
                    Internet
                        |
                        v
              +-------------------+
              |   API Gateway VM  |
              |   iii-http Worker |
              +-------------------+
                        |
                        | RPC
                        v
              +-------------------+
              | Caller Worker VM  |
              | TypeScript Worker |
              +-------------------+
                        |
                        | RPC
                        v
              +-------------------+
              | Inference Worker  |
              | Python Worker     |
              | GGUF AI Model     |
              +-------------------+
```

---

# Project Components

## 1. API Gateway VM

Responsibilities:

* Hosts the III HTTP worker
* Exposes `/v1/chat/completions` endpoint
* Accepts incoming JSON requests
* Dispatches inference requests into the worker mesh

---

## 2. Caller Worker VM

Responsibilities:

* Receives RPC requests from API gateway
* Communicates with inference worker through III Engine RPC
* Handles orchestration between workers
* Returns JSON responses back to the API layer

Technology Used:

* TypeScript
* Node.js
* iii-sdk

---

## 3. Inference Worker VM

Responsibilities:

* Loads GGUF language model
* Runs model inference
* Processes prompts and generates responses
* Returns generated output to caller worker

Technology Used:

* Python
* Transformers
* GGUF Model
* III Python SDK

---

# Cloud Infrastructure

The infrastructure was provisioned using Terraform.

## Infrastructure Includes

* Custom VPC
* Public Subnet
* Private Subnet
* Route Tables
* Internet Gateway
* NAT Gateway
* Security Groups
* Multiple EC2 Instances

---

# Security Architecture

The deployment follows private network communication principles.

## Network Design

* Workers communicate only through the private subnet
* Inference workers are not exposed to the public internet
* Only the API endpoint is publicly reachable
* RPC communication occurs internally within the VPC

---

# Technologies Used

## Infrastructure

* Terraform
* AWS EC2
* VPC Networking
* Security Groups

## Backend

* Python
* TypeScript
* Node.js
* III Engine
* RPC Architecture

## AI Stack

* GGUF Models
* Hugging Face Transformers
* Gemma 3 270M GGUF Model

---

# Folder Structure

```text
distributed-ai-inference-platform/
│
├── terraform/
│   ├── provider.tf
│   ├── vpc.tf
│   ├── subnet.tf
│   ├── security-group.tf
│   ├── ec2.tf
│   └── outputs.tf
│
├── devops-assignment/
│   ├── workers/
│   │   ├── caller-worker/
│   │   └── inference-worker/
│   │
│   ├── config.yaml
│   └── package.json
│
├── screenshots/
│   ├── api-response.png
│   ├── worker-logs.png
│   ├── caller-worker-running.png
│   ├── inference-worker-running.png
│   └── vpc-architecture.png
│
└── README.md
```

---

# Infrastructure Deployment

## Step 1 — Clone Repository

```bash
git clone <repository-url>
cd distributed-ai-inference-platform
```

---

## Step 2 — Initialize Terraform

```bash
cd terraform
terraform init
```

---

## Step 3 — Review Terraform Plan

```bash
terraform plan
```

---

## Step 4 — Provision Infrastructure

```bash
terraform apply -auto-approve
```

This provisions:

* VPC
* Subnets
* Security Groups
* EC2 Instances
* Networking Resources

---

# Worker Deployment

## Install III Engine

```bash
curl -fsSL https://install.iii.dev/iii/main/install.sh | sh
source ~/.bashrc
```

---

## Start III Engine

```bash
iii up
```

---

# Caller Worker Setup

## Navigate to Worker Directory

```bash
cd devops-assignment/workers/caller-worker
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Caller Worker

```bash
npm run dev
```

---

# Inference Worker Setup

## Navigate to Worker Directory

```bash
cd devops-assignment/workers/inference-worker
```

---

## Create Virtual Environment

```bash
python3 -m venv venv
```

---

## Activate Virtual Environment

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Inference Worker

```bash
python3 inference_worker.py
```

---

# API Endpoint

## Endpoint

```text
POST /v1/chat/completions
```

---

# Example API Request

```bash
curl -X POST http://<PUBLIC-IP>:3111/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}'
```

---

# Example JSON Response

```json
{
  "result": {
    "response": "Hello! How can I help you?"
  }
}
```

---

# RPC Flow

```text
Client Request
      ↓
III HTTP Worker
      ↓
Caller Worker
      ↓
Inference Worker
      ↓
GGUF Model
      ↓
Generated Response
      ↓
JSON API Response
```

---

# Screenshots

The repository includes screenshots demonstrating:

* Successful API response
* RPC worker communication
* Worker registration
* VPC architecture
* Running inference workers
* Running caller workers

---

# Production Hardening Considerations

Before deploying this system into production, the following improvements would be implemented:

## Security

* HTTPS/TLS termination
* API authentication
* Secrets management
* IAM least privilege policies
* Private load balancers

---

## Scalability

* Kubernetes deployment
* Auto-scaling worker pools
* Distributed queue systems
* Load balancing
* Horizontal scaling

---

## Observability

* Centralized logging
* Metrics collection
* Distributed tracing
* Health checks
* Alerting systems

---

## Reliability

* Multi-AZ deployment
* Automated backups
* Retry policies
* Circuit breakers
* Rolling deployments

---

# If the Model Were 100x Larger

If the deployed model were significantly larger, the architecture would change in the following ways:

## GPU Infrastructure

* GPU-enabled EC2 instances
* Multi-GPU inference
* Model sharding
* Tensor parallelism

---

## Container Orchestration

* Kubernetes cluster deployment
* GPU scheduling
* Model autoscaling
* Distributed inference serving

---

## Storage Improvements

* Shared model storage
* Distributed file systems
* Object storage integration
* Faster model caching

---

## Performance Optimization

* Quantization optimization
* Streaming inference
* Request batching
* Response caching

---

# Project Status

## Completed Features

* Terraform-based infrastructure provisioning
* Multi-VM deployment
* RPC worker communication
* Distributed inference pipeline
* GGUF model integration
* JSON API endpoint
* End-to-end inference response

---

# Conclusion

This project successfully demonstrates a distributed AI inference system using RPC-based worker orchestration across multiple cloud VMs.

The architecture separates API handling, orchestration, and model inference into independent worker services connected through the III Engine.

The project highlights infrastructure automation, distributed systems design, cloud networking, and AI model serving concepts in a production-style environment.
