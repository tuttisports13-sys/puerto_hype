app_js = File.read('js/app.js', encoding: 'utf-8')

replacement = <<~JS
        ${product.section === 'preorder' ? '' : `
        <div class="product-pricing">
          <span class="price-wholesale">$${product.price} MXN</span>
          <span class="price-retail">$${product.retailPrice}</span>
        </div>
        `}
JS

# We find the product-pricing block
block_to_replace = /<div class="product-pricing">\s*<span class="price-wholesale">\$?\$\{product\.price\} MXN<\/span>\s*<span class="price-retail">\$?\$\{product\.retailPrice\}<\/span>\s*<\/div>/

app_js.sub!(block_to_replace, replacement.strip)

File.write('js/app.js', app_js)
puts "Updated pricing block in app.js"
