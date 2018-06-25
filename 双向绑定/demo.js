import Vue from 'vue';
const component = {
	props: ['value'],
	template : `
		<div>
			<input type="text" @input="handleInput"  :value="value"/>
		</div>
	`,
	methods: {
		handleInput(e){
			this.$emit('input',e.target.value)
		}
	}
}

new Vue({
	components:{
		CompA:component
	},
	el:'#root',
	template:`
		<div>
			<comp-a :value="value" @input="value = arguments[0]"></comp-a>
		</div>
	`,
	data() {
		return {
			value:'lsy'
		}
	}
})