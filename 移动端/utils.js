function toRem(n) {
  return parseInt(n, 10) ? `${(parseInt(n, 10) / 75)}rem` : `0`;
}

function getStyle(sourceStyleObj = {}) {
  const destStyleObj = {}
  for (let key in sourceStyleObj) {
    const value = sourceStyleObj[key]
    if (value) {
      if (/^(margin|padding)/.test(key)) {
        destStyleObj[key] = toRem(value)
      } else {
        destStyleObj[key] = value
      }
    }
  }
  return destStyleObj
}

//自适应fontsize
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
function adaptFont() {
  window.clientWidth = Math.min(document.documentElement.getBoundingClientRect().width, 750)
  document.documentElement.style.fontSize =  window.clientWidth / 10 + 'px'
}
adaptFont()
window.addEventListener("load", adaptFont)
window.addEventListener("resize", adaptFont)

const baseStyleLoaders = [
  {
    loader: require.resolve('px2rem-loader'),
    options: {
      remUnit: 75,
      remPrecision: 8
    }
  },
  {
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: [
            'last 2 versions',
            'Android >= 2.3',
            'IE>8',
            'Firefox > 20',
            'iOS >= 8'
          ],
          // flexbox: 'no-2009',
        }),
      ],
    },
  },
]

//配置loader
{
  test: /\.scss$/,
  use: [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 3,   //Number of loaders applied before CSS loader
        sourceMap: true,
        modules: true,
        localIdentName: '[local]_[hash:base64:5]'
      },
    },
    ...baseStyleLoaders,
    require.resolve('sass-loader')
  ],
},