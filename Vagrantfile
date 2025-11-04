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

echo "export DB_HOST=#{DB_HOST}" >> /home/vagrant/.bashrc
echo "export DB_USERNAME=#{DB_USERNAME}" >> /home/vagrant/.bashrc
echo "export DB_PASSWORD=#{DB_PASSWORD}" >> /home/vagrant/.bashrc
echo "export DB_NAME=#{DB_NAME}" >> /home/vagrant/.bashrc
echo "export APP_PORT=#{APP_PORT}" >> /home/vagrant/.bashrc
echo "export DOMAIN=#{DOMAIN}" >> /home/vagrant/.bashrc

sudo apt-get  install -y pip
sudo apt-get install -y python3.12-venv
cp /vagrant/app/api -r ~/
cd ~/api
python3 -m venv .venv
source .venv/bin/activate
pip install .

sudo tee /etc/systemd/system/apiapp.service > /dev/null <<'EOF'
[Unit]
Description=Api app
After=network.target

[Service]
User=vagrant
Group=vagrant
WorkingDirectory=/home/vagrant/api
Environment="PATH=/home/vagrant/api/.venv/bin"
ExecStart=/home/vagrant/api/.venv/bin/python3 /home/vagrant/api/app.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable apiapp
sudo systemctl start apiapp
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
