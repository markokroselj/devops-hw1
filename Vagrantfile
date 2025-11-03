$script = <<-'SCRIPT'
sudo apt-get update
sudo apt-get install -y caddy
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp-education/ubuntu-24-04"
  config.vm.box_version = "0.1.0"
  config.vm.provision "shell", inline: $script

  config.vm.provider "virtualbox" do |v|
    v.name = "devops-hw1-ubuntu24-vm"
    v.memory = 2048
    v.cpus = 2
  end

  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 443, host: 443
end
