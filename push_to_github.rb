require 'net/http'
require 'json'
require 'base64'
require 'find'

token = ARGV[0] || ENV['GITHUB_TOKEN']
if token.nil? || token.empty?
  puts "Uso: ruby push_to_github.rb <TU_GITHUB_PERSONAL_ACCESS_TOKEN>"
  exit 1
end

owner = 'tuttisports13-sys'
repo = 'puerto_hype'
branch = 'main'
base_dir = File.expand_path(__dir__)

files_to_upload = []

Find.find(base_dir) do |path|
  next if File.directory?(path)
  rel_path = path.sub("#{base_dir}/", '')
  next if rel_path.start_with?('.git') || rel_path.end_with?('.log') || rel_path == 'push_to_github.rb' || rel_path == 'server.rb' || rel_path == '.DS_Store'
  files_to_upload << { rel: rel_path, full: path }
end

puts "📦 Subiendo #{files_to_upload.size} archivos a https://github.com/#{owner}/#{repo} en rama '#{branch}'..."

files_to_upload.each do |f|
  content = File.read(f[:full])
  b64_content = Base64.strict_encode64(content)
  
  uri = URI("https://api.github.com/repos/#{owner}/#{repo}/contents/#{f[:rel]}")
  
  # Verificar si el archivo ya existe para obtener su SHA
  get_req = Net::HTTP::Get.new(uri)
  get_req['Authorization'] = "Bearer #{token}"
  get_req['Accept'] = 'application/vnd.github.v3+json'
  get_req['User-Agent'] = 'Puerto-Hype-Deployer'
  
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  get_res = http.request(get_req)
  
  existing_sha = nil
  if get_res.code.to_i == 200
    file_info = JSON.parse(get_res.body)
    existing_sha = file_info['sha']
  end

  req = Net::HTTP::Put.new(uri)
  req['Authorization'] = "Bearer #{token}"
  req['Accept'] = 'application/vnd.github.v3+json'
  req['User-Agent'] = 'Puerto-Hype-Deployer'
  req['Content-Type'] = 'application/json'

  payload = {
    message: "Deploy #{f[:rel]} - Puerto Hype Web",
    content: b64_content,
    branch: branch
  }
  payload[:sha] = existing_sha if existing_sha

  req.body = JSON.generate(payload)
  res = http.request(req)

  if res.code.to_i >= 200 && res.code.to_i < 300
    puts "  ✅ #{f[:rel]} subido con éxito"
  else
    puts "  ❌ Error al subir #{f[:rel]}: #{res.code} - #{res.body}"
  end
end

puts "\n🎉 ¡Todos los archivos han sido subidos exitosamente a GitHub!"
