app_js = File.read('js/app.js', encoding: 'utf-8')

# Change addToCart to use price 0 for preorder
app_js.sub!(/price: product\.price,\n\s*retailPrice: product\.retailPrice,/, 
  "price: product.section === 'preorder' ? 0 : product.price,\n      retailPrice: product.section === 'preorder' ? 0 : product.retailPrice,")

# Change cart item price display
app_js.sub!(/<span class="cart-item-price">\$?\$\{item\.price \* item\.quantity\} MXN<\/span>/, 
  "<span class=\"cart-item-price\">${item.id.startsWith('po-') ? '<span style=\"color:var(--neon-lime)\">Cotizar</span>' : '$' + (item.price * item.quantity) + ' MXN'}</span>")

File.write('js/app.js', app_js)
puts "Updated cart logic to handle 0 price for preorder."
