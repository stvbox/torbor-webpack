<template>
    <div class="geo-input-holder form-control" >
        <!--
        <div>{{value}}</div>
        <div>{{loader}}</div>
        -->
        <div class="input-border" >
            <div :style="adressStyle" class="input-address" >
                <span>{{ currentAddress }}</span>
            </div>
            <div :style="placesStyle" class="input-places shadow-sm p-1 mb-5 bg-white rounded" :class="{loader: loader}" >
                <div v-for="item of variants" :key="item.place_id" @mousedown="selectAddress(item)" >
                        <!-- {{ item.formatted_address }} -->
                        {{ item.formatted_address }}
                </div>
            </div>
            <input
                v-model="searchPhrase"
                @focus="onFocus()"
                @blur.self="onBlur()"
                @keyup="searchPlace($event.target.value)"
                :style="inputStyle"
            />
        </div>
    </div>
</template>

<script>
/*
* Элемент инпут контрола выбора пункта
*/
import dataService from './DataService'

export default {
    template: '#geo-place-input',
    mixins: [dataService],
    props: ['value'],
    data: function() {
        return {
            debug: null,
            editMode: false,
            searchPhrase: '',
            variants: [],
            inputTimer: null,
            loader: false
        };
    },
    computed: {
        currentAddress: function() {
            if(this.value && this.value.formatted_address) {
                return this.value['formatted_address'];
            }
            return '(пункт не выбран)';
        },
        inputStyle: function() {
            var oStyle = {};
            if(this.editMode) {
                oStyle = {
                };
            }
            else {
                oStyle = {
                    'color': 'transparent',
                    'background-color': 'transparent'
                };
            }
            return oStyle;
        },
        adressStyle: function() {
            return {
                display: this.editMode?'none':'block'
            }
        },
        placesStyle: function() {

            //console.log('this.variants.length: ' + this.variants.length);

            return {
                //display: (this.editMode && this.variants.length)?'block':'none',
                display: (this.editMode)?'block':'none',
            }
        }
    },
    methods: {
        searchPlace: function(address) {
            var that = this;
            this.loader = true;
            
            console.log('запрос: ' + address);
            clearTimeout(this.inputTimer);

            this.inputTimer = setTimeout(function() {
                var timer = that.inputTimer;

                that.geocoding(address, function(response) {
                    if(timer != that.inputTimer) return;
                    that.loader = false;

                    console.log('ответ: ' + address);
                    console.log(JSON.stringify(response.data.results));
                    if(response.data.results)
                        that.variants = response.data.results;
                    else
                        that.variants = [];
                });
            }, 1000);

        },
        selectAddress: function(item) {
            //console.log(JSON.stringify(item))
            //this.value = item;
            this.$emit('input', item);
            this.searchPhrase = '';
        },
        onFocus: function() {
            console.log('onFocus');
            this.editMode = true;
        },
        onBlur: function() {
            console.log('onBlur');
            this.editMode = false;
        }
    }
}
</script>

<style>
.geo-input-holder {
    display: inline-block;
}
.geo-input-holder * {
    /*margin: 1px;
    border: 1px black solid;*/
}
.geo-input-holder input {
    width: 100%;
    position: relative;
    z-index: 1;
    background-color: transparent;
    border: none;
    outline:none;
    /*border: 1px black solid;
    border-radius: 5px;*/
}
.input-border {
    position: relative;
}
.input-address {
    width: 95%;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    overflow: hidden;
}
.input-address > span {
    margin: 5px;
    /*font-size: 10px;*/
    white-space: nowrap;
}
.input-places {
    width: 100%;
    min-height: 1em;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    background-color: white;
}
.input-places > div {
    cursor: pointer;
}
.input-places > div:hover {
    background-color: yellow;
}
.row {
    padding: 20px;
}
.row > * {
    padding: 5px;
}
.loader {
    background: url(/static/assets/timer.svg) no-repeat;
    background-size: 1em;
    background-position: center;
    color: transparent!important;
}
</style>