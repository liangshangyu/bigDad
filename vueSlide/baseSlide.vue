<!--实现vue中共用的滑动插件-->

<template>
    <div>
        <ol class="slide-dots">
            <li v-for="page in pageCount" :key="page">
                <a href="javascript:void(0)" :style="activePageStyle(page -1)"
                    @click="toPage(page -1)"
                   :style="activePageStyle(page -1)"
                ></a>
            </li>
        </ol>
        <!--左右按钮-->
        <div class="slide-buttons">
            <a href="javascript:void(0)" class="prev-page"
                :style="{background:backgroundColor}"
               @click="toPage(prevPage, 'left')"
            >
                ‹
            </a>

            <a href="javascript:void(0)" class="next-page"
               :style="{background:backgroundColor}"
               @click="toPage(prevPage, 'right')"
            >
                ›
            </a>
        </div>
    </div>
</template>
<script>
    export default{
        name:'BadeSlide',
        props: {
            pageCount: {
                type: Number,
                require: true
            },
            currentPage: {
                type: Number,
                require: true
            },
            backgroundColor: {
                type: String,
                default: '#9b9a8e'
            }
        },
        data(){
            return {}
        },
        computed: {
            prevPage () {
                return this.currentPage === 0? this.pageCount - 1 : this.currentPage -1
            },
            nextPage () {
                return this.currentPage === this.pageCount - 1? 0: this.currentPage + 1
            }
        },
        components: {},
        methods: {
            toPage (page, direction) {
                //判断滑动的方向
                let slideDirection
                if(direction) {
                    slideDirection = direction
                }else {
                    slideDirection = page < this.currentPage ? 'left': 'right'
                }
                this.$emit('change-page', page)
                this.$emit('change-direction', slideDirection)
            },
            activePageStyle (page) {
                if(page === this.currentPage) {
                    return {
                        background: this.backgroundColor
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .slide-dots {
        display: inline-block;
    }
    .slide-dots li{
        display: inline-block;
    }
    .slide-dots a{
        width: 5px;
        height: 5px;
        display: inline-block;
        margin-left: 8px;
        border-radius: 5px;
        background: #dfdfdf;
    }
    .slide-buttons{
        display: inline-block;
    }
    .prev-page,
    .next-page{

    }
</style>