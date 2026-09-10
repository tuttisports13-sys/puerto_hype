require 'net/http'
require 'uri'
require 'openssl'
require 'json'

uri = URI("https://wa.me/c/5212294135613")
req = Net::HTTP::Get.new(uri)
req['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true, verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
  http.request(req)
end

puts res.body.force_encoding("utf-8")
