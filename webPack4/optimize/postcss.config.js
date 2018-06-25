/**
 * Created by 17073565 on 2018/5/14.
 */
module.exports = {
    plugins: [
        require('autoprefixer')(),
        require('postcss-sprites')({
            filterBy(image) {
                if(/sprites/.test(image.url)) {
                    return Promise.resolve()
                }else {
                    return Promise.reject()
                }
            }
        })
    ]
}