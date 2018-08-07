# react-native-sf-tablist


# 支持多页数据切换，上拉刷新
# 支持tab上方悬浮
# 支持数据缓存，在切换时无卡顿感
# 支持空数据的页面显示
# 支持tab展开选择




# 安装
* npm install react-native-sf-tablist


# Props
|  parameter  |  type  |  required  |   description  |  default  |
|:-----|:-----|:-----|:-----|:-----|
|tabFloatTop|number|yes|tabbar距离屏幕顶端的高度（一般为header的高度）|0|
|headerComponent|any|no|头部控件|null|
|barHeight|number|no|bar的高度|40|
|barWidth|number|no|每个bar的宽度|50|
|barTitles|array|yes|bar 标题数组|[['全部','热门'], '附近', '精选','热销']|
|emptyComponent|any|no|空数据时显示组件|null|
|emptyDefaultTitle|string|no|emptyComponent为空时默认空数据标题|'没有数据'|
|emptyDefaultColor|string|no|emptyComponent为空时默认空数据颜色|'rgba(200,200,200,1)'|
|emptyDefaultFontSize|number|no|emptyComponent为空时默认提示字体大小|15|
|barContentStyle|any|no|整行bar的样式设置（如背景颜色，边框等）|borderBottomWidth:1,borderBottomColor:'rgba(240,240,240,1)',backgroundColor: 'white',|
|barTextStyle|any|no|bar标题样式（颜色、大小等）|color:'#5a5a5a',fontSize:15|
|barTextSelectStyle|any|no|bar标题选中样式（颜色、大小等）|color:'black',fontSize:15|
|barTriangleColor|string|no|bar倒三角颜色（bar可多选时设置）|#c8c8c8|
|barTriangleSize|number|no|bar倒三角大小（bar可多选时设置）|6|
|barItemTextStyle|any|no|bar展开子项的标题样式|color:'#333333',fontSize:15,marginLeft:20|
|barItemFooterStyle|any|no|bar展开列表底部样式|height:10,borderBottomWidth:1,borderBottomColor:'rgba(200,200,200,1)'|
|barItemSeparatorStyle|any|no|bar展开子项的分隔样式|height:1,backgroundColor:'rgba(240,240,240,1)'|
|onEndShouldRate|number|no|开始上拉刷新的距离(0-1)|0.2|
|onReqData|func|yes|需要请求数据时自动调用|null|
|onBeginRefreshFooter|func|no|上拉刷新回调|null|
|onListScroll|func|no|列表滚动回调|null|


# Methods
|  Methods  |  Params  |  Param Types  |   description  |  Example  |
|:-----|:-----|:-----|:-----|:-----|
|setData|data|null|onReqData调用中，数据请求回调里设置，即第一页的数据||
|addData|data|null|上拉刷新时需要增加数据时调用||
|endRefreshFooter|null|null|结束上拉刷新（数据更新成功后调用）||
|endRefreshNomore|null|null|结束上拉刷新,没有更多数据状态，再次加载不会调用onBeginRefreshFooter（数据更新成功后调用）||


# 例子
```
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableHighlight,Image,Dimensions} from 'react-native';
import SFTabList from "react-native-sf-tablist"
import SFNet from "react-native-sf-net"
const {width,height} = Dimensions.get('window')
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentWillMount(){
        SFNet.config('https://api.food.d2.sf-soft.com/client/');

    }
    renderItems = ({item, index}) => {
        return (
            <View style={{
                padding:20
            }}>
                <Text>
                    {item.shop_name}
                </Text>
                <Image source={{uri:item.shop_banner}} style={{
                    width:width-40,
                    height:100,
                    marginTop:10
                }}>

                </Image>
            </View>
        )
    }
    renderSepara = () => {
        return (
            <View style={{
                height: 10
            }}>

            </View>
        )
    }
    renderHeader = () => {
        return (
            <View style={{
                height:150,
                backgroundColor:'red'
            }}>

            </View>
        )
    }
    clickTest = () => {
        this.tabList.addData(this.state.ds[1]);
    }
    clickBar = (index) => {
        //this.tabList.setData(this.state.ds[index])
    }
    onReqData = (index) => {
        var params = {
            token: '5A1d2sKw2oh4Ewd8SNPyz2ShmcDgUKrg',
            page: 1,
            shop_type: 57,
            type: index,
            la: '121.587767',
            lo: '38.913846',
        }
        SFNet.post('shop/list',params,(ret)=>{
            console.log(ret);
            this.tabList.setData(ret.data);
        },(err)=>{
            console.log(error)
        });

    }
    onBeginRefreshFooter = () => {
        // this.tabList.addData(this.state.ds[1]);
        this.tabList.endRefreshNomore()
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{
                    height:50,
                    backgroundColor:'black'
                }}>

                </View>
                <SFTabList
                    ref={(ref)=>{this.tabList = ref}}
                    barTitles={[['全部','哈哈'], '附近', '精选','热销']}
                    barWidth={width/4}
                    barHeight={50}
                    renderItem={this.renderItems}
                    headerComponent={this.renderHeader}
                    ItemSeparatorComponent={this.renderSepara}
                    onReqData={this.onReqData}
                    onBeginRefreshFooter={this.onBeginRefreshFooter}
                    clickBar={this.clickBar}
                    showsVerticalScrollIndicator={false}
                    tabFloatTop={50}
                >

                </SFTabList>
            </View>
        );
    }
}


```
