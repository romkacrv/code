const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    js: './assets/js/js.js',
    index: './assets/js/pages/index.js',
    hwa: './assets/js/pages/hwa.js',
    services: './assets/js/pages/services.js'
    // ,
    // page404: './assets/js/pages/page404.js'
  },
  plugins: [].concat([
    {
      page: 'index',
      title: 'Home'
    },
    {
      page: 'services',
      title: 'Services'
    },
    {
      page: 'hwa',
      title: 'How we work'
    },
    {
      page: 'clients',
      title: 'Clients'
    }
    // ,
    // {
    //   page: 'page404',
    //   title: 'Not found'
    // }
  ].map(item => {
    return new HtmlWebpackPlugin({
      title: item.title,
      hash: true,
      favicon: './assets/img/fav-icon.ico',
      filename: `${item.page}.html`,
      template: `${item.page}.html`,
      inject: true,
      chunks: [item.page, `${item.page}`]
    })
  }), [
    new ExtractTextPlugin({
      filename: './assets/css/[name][contenthash].css'
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'jquery': 'jquery',
      'window.jquery': 'jquery',
      '$': 'jquery',
      'window.$': 'jquery'
    }),
    new CleanWebpackPlugin(['dist'])
  ]),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: './assets/js/[name][hash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.css', '.scss']
  },
  context: path.resolve(__dirname, 'src'),
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'underscore-template-loader',
          }
        ]
      },
      {
        test: /\.(jsx|js)$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react'
            ]
          }
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  require('bourbon').includePaths,
                  require('bourbon-neat').includePaths
                ]
              },
            }
          ],
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 5000,
              name: '[path][name][hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[path][name][hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }
        ]
      },
    ]
  },
}
