css = File.read('css/styles.css', encoding: 'utf-8')

css.sub!(/\.app-container\s*\{\s*width:\s*100%;\s*max-width:\s*500px;/, ".app-container {\n  width: 100%;\n  max-width: 1200px;")
css.sub!(/\.bottom-nav\s*\{\s*position:\s*fixed;\s*bottom:\s*0;\s*left:\s*50%;\s*transform:\s*translateX\(-50%\);\s*width:\s*100%;\s*max-width:\s*500px;/, ".bottom-nav {\n  position: fixed;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 100%;\n  max-width: 1200px;")
css.sub!(/\.products-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*1fr\);/, ".products-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));")
css.sub!(/\.props-section\s*\{\s*padding:\s*18px\s*14px;\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*1fr\);/, ".props-section {\n  padding: 18px 14px;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));")

File.write('css/styles.css', css)
puts "Updated styles.css to be responsive for PC."
