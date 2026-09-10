require 'json'

stock = [
  { name: 'Hoka Clifton', size: '26.5 cm', price: 1000 },
  { name: 'Puma Embroidery', size: '26.5 cm', price: 550 },
  { name: 'Nike Sacai', size: '25 cm', price: 1200 },
  { name: 'Jordan series s', size: '26 cm', price: 800 },
  { name: 'Adidas', size: '25 cm', price: 550 },
  { name: 'Jordan 1 mid', size: '26 cm', price: 1200 },
  { name: 'Spikes atletismo', size: '26 cm', price: 750 },
  { name: 'Spikes atletismo', size: '25 cm', price: 750 },
  { name: 'Brooks Ghost', size: '26 cm', price: 850 },
  { name: 'Saucony Endorphin', size: '24 cm', price: 1000 },
  { name: 'Spikes Nike zoom', size: '25 cm', price: 750 },
  { name: 'Puma', size: '26 cm', price: 550 },
  { name: 'Nike Phantom élite', size: '26.5 cm', price: 2700 },
  { name: 'Nike Tiempo Legend X elite', size: '26.5 cm', price: 2700 },
  { name: 'Adidas Copa Mundial', size: '26.5 cm', price: 2700 },
  { name: 'Mercurial Elite tacos de metal', size: '26.5 cm', price: 2700 },
  { name: 'Puma Palace Guard', size: '26.5 cm', price: 600 },
  { name: 'On cloud Rogers', size: '26.5 cm', price: 1200 },
  { name: 'Reebok x Joker', size: '26.5 cm', price: 700 },
  { name: 'Brooks adrenaline', size: '28 cm', price: 800 },
  { name: 'On cloud X', size: '28 cm', price: 1200 },
  { name: 'Nike Jordan 1 Low bred Toe', size: '27.5 cm', price: 1300 }
]

stock_objects = stock.map.with_index do |p, i|
  # Using reliable unsplash sneaker images
  images = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80'
  ]
  {
    id: "stock-#{sprintf('%03d', i+1)}",
    name: p[:name],
    category: 'sneakers',
    price: p[:price],
    retailPrice: (p[:price] * 1.5).round,
    badge: i < 3 ? 'STOCK' : (i % 5 == 0 ? 'OFERTA' : ''),
    badgeType: i < 3 ? 'badge-hot' : (i % 5 == 0 ? 'badge-sale' : ''),
    image: images[i % images.length],
    sizes: [p[:size]]
  }
end

js_file = 'js/app.js'
app_js = File.read(js_file, encoding: 'utf-8')

# Regex to find the whole STOCK_PRODUCTS array
if app_js.match(/const STOCK_PRODUCTS = \[.*?\];/m)
  app_js.sub!(/const STOCK_PRODUCTS = \[.*?\];/m, "const STOCK_PRODUCTS = #{JSON.pretty_generate(stock_objects)};")
  File.write(js_file, app_js)
  puts "Stock products replaced successfully!"
else
  puts "Could not find STOCK_PRODUCTS array in app.js!"
end
