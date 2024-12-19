import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ], // Adiciona style-loader e css-loader
      },
    ]
  },
  resolve: { extensions: [ ".js", ".jsx" ] },
  plugins: [ new HtmlWebpackPlugin({ template: "./public/index.html" }) ],
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    port: 3000
  }
};