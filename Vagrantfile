DB_HOST =
DB_USERNAME =
DB_PASSWORD =
DB_NAME = 
APP_PORT =
DOMAIN=

$script = <<-SCRIPT
sudo apt-get update
sudo apt-get install -y caddy

sudo apt-get install -y mysql-server
sudo mysql -u root -e "CREATE USER '#{DB_USERNAME}'@'localhost' IDENTIFIED WITH caching_sha2_password BY '#{DB_PASSWORD}';"
sudo mysql -u root -e "CREATE DATABASE #{DB_NAME}";
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON  #{DB_NAME}.* TO '#{DB_USERNAME}'@'#{DB_HOST}'; FLUSH PRIVILEGES;"
sudo mysql -u #{DB_USERNAME} -p#{DB_PASSWORD} #{DB_NAME} < /vagrant/app/db/dbsetup.sql
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
