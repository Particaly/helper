import {getType} from "@/library/Functional";

let VueMsg = {
	methods: {
		$message(type, ...args) {
			if(this.parent){
				if(getType(this.parent.readMessage) === 'function'){
					this.parent.readMessage(type, ...args);
				}
				this.parent.$message(type, ...args);
			}
			if(this.$parent){
				if(getType(this.$parent.readMessage) === 'function'){
					this.$parent.readMessage(type, ...args);
				}
				this.$parent.$message(type, ...args);
			}
		}
	},
}

export default VueMsg
