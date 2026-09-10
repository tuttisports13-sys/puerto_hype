require 'json'

app_js = File.read('js/app.js', encoding: 'utf-8')
preorder_json = File.read('preorder_products.json', encoding: 'utf-8')

replacement = <<~JS
// Catálogo de Pre-orden (Generado)
const PREORDER_PRODUCTS = #{preorder_json};
JS

app_js.sub!(/let PREORDER_PRODUCTS = \[\];\s*\/\/ Fetch preorder products.*?\.catch\(err => console\.error\("Error loading preorder products:", err\)\);/m, replacement)

File.write('js/app.js', app_js)
puts "Inlined preorder_products.json into js/app.js successfully."
