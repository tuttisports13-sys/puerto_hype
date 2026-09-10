require 'fileutils'

app_js = File.read('js/app.js', encoding: 'utf-8')

# We need to replace the product-pricing block
original_pricing = <<~HTML
        <div class="product-pricing">
          <span class="price-wholesale">$${product.price} MXN</span>
          <span class="price-retail">$${product.retailPrice}</span>
        </div>
HTML

new_pricing = <<~HTML
        ${product.section === 'preorder' ? 
          `<div class="product-pricing" style="justify-content: center;">
             <span class="price-wholesale" style="font-size: 0.9rem; color: var(--neon-lime);">Cotizar precio</span>
           </div>` 
          : 
          `<div class="product-pricing">
             <span class="price-wholesale">$${product.price} MXN</span>
             <span class="price-retail">$${product.retailPrice}</span>
           </div>`
        }
HTML

app_js.sub!(original_pricing.strip, new_pricing.strip)

# Save the file
File.write('js/app.js', app_js)
puts "Updated app.js to hide prices for preorder products."
