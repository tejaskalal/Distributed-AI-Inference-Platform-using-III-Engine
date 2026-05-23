resource "aws_instance" "api_vm" {
  ami                    = "ami-091138d0f0d41ff90"
  instance_type          = "c7i-flex.large"
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.api_sg.id]
  key_name               = "mayur"

  tags = {
    Name = "api-vm"
  }
}

resource "aws_instance" "caller_worker_vm" {
  ami                    = "ami-091138d0f0d41ff90"
  instance_type          = "c7i-flex.large"
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.worker_sg.id]
  key_name               = "mayur"

  tags = {
    Name = "caller-worker-vm"
  }
}

resource "aws_instance" "inference_worker_vm" {
  ami                    = "ami-091138d0f0d41ff90"
  instance_type          = "c7i-flex.large"
  subnet_id              = aws_subnet.private_subnet.id
  vpc_security_group_ids = [aws_security_group.worker_sg.id]
  key_name               = "mayur"

  tags = {
    Name = "inference-worker-vm"
  }
}
