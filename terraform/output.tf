output "api_vm_public_ip" {
  value = aws_instance.api_vm.public_ip
}

output "caller_worker_private_ip" {
  value = aws_instance.caller_worker_vm.private_ip
}

output "inference_worker_private_ip" {
  value = aws_instance.inference_worker_vm.private_ip
}
