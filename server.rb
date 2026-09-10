$stdout.sync = true
$stderr.sync = true

require 'webrick'

root = File.expand_path(__dir__)
port = 8080

mime_types = WEBrick::HTTPUtils::DefaultMimeTypes.merge({
  'svg' => 'image/svg+xml',
  'webp' => 'image/webp',
  'woff2' => 'font/woff2',
  'woff' => 'font/woff',
  'ttf' => 'font/ttf'
})

server = WEBrick::HTTPServer.new(
  Port: port,
  BindAddress: '127.0.0.1',
  DocumentRoot: root,
  MimeTypes: mime_types,
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO)
)

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "=" * 55
puts "🔥 PUERTO HYPE - MAYOREO STREETWEAR"
puts "🚀 Servidor local activo en: http://localhost:#{port}"
puts "=" * 55

server.start
