Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "512"
  end

  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install -y build-essential
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.1/install.sh | bash
    . ~/.nvm/nvm.sh
    nvm install stable
    nvm alias default stable
  SHELL
end
