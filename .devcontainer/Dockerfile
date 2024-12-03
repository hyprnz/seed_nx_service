# Start with a Node base image:
FROM node:20 AS base

#Install updates and dependencies
RUN apt-get update && apt-get install -y \
  ca-certificates \
  curl


# Node may come with an outdated version of npm. Ensure we have latest npm.
RUN npm install -g npm

# Install testing capabilities
RUN npm install -g playwright
RUN npx playwright install-deps && npx playwright install

#Change files permissions
RUN chmod -R 777 /root

# Download and install terraform
RUN apt-get update && apt-get install -y gnupg software-properties-common
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
RUN gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
RUN echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list
RUN apt update && apt-get install -y terraform

#Install htop
RUN apt install -y htop

RUN curl -sS https://starship.rs/install.sh | sh -s -- -y
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

RUN apt-get install -y \
  less \
  unzip \
  bash-completion

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
RUN unzip awscliv2.zip 
RUN ./aws/install 
RUN rm -rf awscliv2.zip aws

# Configure bash
RUN echo '"\e[A": history-search-backward' >> /etc/inputrc
RUN echo '"\e[B": history-search-forward' >> /etc/inputrc

# Set up npm completion
RUN npm completion >> /etc/bash_completion.d/npm

# Install tflint
ARG TFLINT_LINK=https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh
RUN curl -s $TFLINT_LINK | bash

# Install jq
RUN apt-get install -y jq

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*