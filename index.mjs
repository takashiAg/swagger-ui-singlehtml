import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import yaml from 'js-yaml';

// OpenAPIファイル
const input = "input.yml";

// HTMLファイルの出力先
const output = "index.html";

// Swagger UIのHTMLテンプレート
// 参考: https://raw.githubusercontent.com/swagger-api/swagger-ui/master/dist/index.html

const htmldocument=`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>{{TITLE}}</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui.min.css">
    <link rel="icon" type="image/png" href="./favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="./favicon-16x16.png" sizes="16x16">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui-bundle.min.js" charset="UTF-8"> </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui-standalone-preset.min.js" charset="UTF-8"> </script>
    <script>
      window.onload = function() {
      window.ui = SwaggerUIBundle({
        spec: {{SPEC}},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
      };
    </script>
  </body>
</html>
`


const main =async ()=>{
  // YAMLファイルを読み込む
  const yamlContent =await  fs.readFile(input, 'utf8');
  const spec = yaml.load(yamlContent);

  const TITLE = spec?.info?.title || "Swagger UI";
  const htmldocumentReplaced = htmldocument
      .replace('{{TITLE}}', TITLE)
      .replace('{{SPEC}}', JSON.stringify(spec));


  // HTMLファイルを出力
  const dom = new JSDOM(htmldocumentReplaced);
  await fs.writeFile(output, dom.serialize());
};
main ();
