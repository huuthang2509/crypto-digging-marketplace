# Configure the AWS Provider
provider "aws" {
  region = "ap-southeast-1"
}

variable "ingress_rules" {
  type = list(number)
  default = [ 80, 443, 22, 9000, 8080 ]
}

variable "egress_rules" {
  type = list(number)
  default = [ 80, 443, 22, 9000, 8080 ]
}

# Create s3 bucket
resource "aws_s3_bucket" "my-bucket" {
  bucket = "gitlab-credential"
}

# Upload key to s3 bucket
resource "aws_s3_object" "upload_object" {
  bucket = aws_s3_bucket.my-bucket.id
  for_each = fileset("setup-ssh/", "*")
  key = each.value
  source = "setup-ssh/${each.value}"
  etag = filemd5("setup-ssh/${each.value}")
}

# Attach a role for ec2 to get key
#Create a policy give the ability to list and download the objects in bucket
resource "aws_iam_policy" "ec2_policy" {
  name = "ec2_policy"
  path = "/"
  description = "Policy to provide for ec2"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

#Create a role for ec2
resource "aws_iam_role" "ec2_role" {
  name = "ec2_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

#Attach the role to policy
resource "aws_iam_role_policy_attachment" "ec2_role_attach" {
  role = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ec2_policy.arn
}

#Create instance profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2_profile"
  role = aws_iam_role.ec2_role.name
}

# Create web-server
resource "aws_instance" "web" {
  ami = "ami-04d9e855d716f9c99"
  instance_type = "t2.micro"

  key_name = "crypto-ec2-key"
  security_groups = [aws_security_group.web_traffic.name]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  user_data = file("server-script.sh")

  root_block_device {
    volume_size = 16
  }

  tags = {
    "Name" = "Web Server"
  }
}

resource "aws_eip" "elastic_ip" {
  instance = aws_instance.web.id
}

resource "aws_security_group" "web_traffic" {
  name = "Allow web traffic"

  dynamic "ingress" {
    iterator = port
    for_each = var.ingress_rules
    content {
      cidr_blocks = [ "0.0.0.0/0" ]
      from_port = port.value
      to_port = port.value
      protocol = "TCP"
    }
  }

  dynamic "egress" {
    iterator = port
    for_each = var.ingress_rules
    content {
      cidr_blocks = [ "0.0.0.0/0" ]
      from_port = port.value
      to_port = port.value
      protocol = "TCP"
    }
  }
}

output "PublicIP" {
  value = aws_eip.elastic_ip.public_ip
}

output "public_dns" {
  value = aws_eip.elastic_ip.public_dns
}

output "ec2_public_dns" {
  value = aws_instance.web.public_dns
}