# config valid only for current version of Capistrano
lock "3.10.1"

set :application, "webdataconnector"
set :repo_url, "git@github.com:Fizziology/webdataconnector.git"

set :user, "deploy"

set :deploy_to, "/home/deploy/webdataconnector"


# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
#
#
# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5
#

before 'deploy:started', 'pm2:stop'
after 'deploy:finished', 'pm2:start'


namespace :pm2 do
  task :start do

    on roles(:app) do
        execute "cd #{current_path} && pm2 start npm --name #{fetch(:application)} -- start"
    end
  end

  task :stop do

    on roles(:app) do
        execute "cd #{current_path} && pm2 kill"
    end
  end

end
