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
cp /vagrant/app/api -r /home/vagrant/
cd /home/vagrant/api/
python3 -m venv /home/vagrant/api/.venv
source /home/vagrant/api/.venv/bin/activate
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
Environment="DB_HOST=#{DB_HOST}"
Environment="DB_USERNAME=#{DB_USERNAME}"
Environment="DB_PASSWORD=#{DB_PASSWORD}"
Environment="DB_NAME=#{DB_NAME}"
Environment="APP_PORT=#{APP_PORT}"
ExecStart=/home/vagrant/api/.venv/bin/python3 /home/vagrant/api/app.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable apiapp
sudo systemctl start apiapp

sudo mkdir -p /var/www/app
sudo chown -R caddy:caddy /var/www/app
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
#{DOMAIN} {
        root * /var/www/app
        file_server

        handle_path /api/* {
                reverse_proxy localhost:#{APP_PORT}
    }
}
EOF
sudo systemctl reload caddy

sudo cp /vagrant/app/frontend/ -r /var/www/app/
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
