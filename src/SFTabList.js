/**
 * Created by Joker on 2017-08-17.
 */
import React, {Component} from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Text,
    View,
    Dimensions,
    Platform,
    Animated,
    Easing,
    ScrollView,
    findNodeHandle,
    UIManager
} from 'react-native'
import PropTypes from 'prop-types'
import SFTabBar from "./SFTabBar"
import SFTabFooter from "./SFTabFooter"
import SFTabBarTable from "./SFTabBarTable"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width;

export default class SFTabList extends Component {
    static propTypes = {
        tabFloatTop:PropTypes.number.isRequired,
        headerComponent: PropTypes.any,
        barHeight: PropTypes.number,
        barWidth: PropTypes.number,
        barTitles: PropTypes.array.isRequired,

        emptyComponent: PropTypes.any,
        emptyDefaultTitle: PropTypes.string,
        emptyDefaultColor: PropTypes.string,
        emptyDefaultFontSize: PropTypes.number,

        barContentStyle: PropTypes.any,
        barTextStyle: PropTypes.any,
        barTextSelectStyle:PropTypes.any,
        barTriangleColor:PropTypes.string,
        barTriangleSize:PropTypes.number,
        barItemTextStyle:PropTypes.any,
        barItemFooterStyle:PropTypes.any,
        barItemSeparatorStyle:PropTypes.any,
        barCursorColor: PropTypes.string,
        barCursorHeight:PropTypes.number,

        onEndShouldRate: PropTypes.number,
        onClickBar: PropTypes.func.isRequired,
        onReqData: PropTypes.func.isRequired,
        onBeginRefreshFooter: PropTypes.func,
        onListScroll: PropTypes.func,
    }
    static defaultProps = {
        tabFloatTop: 0,
        barHeight: 40,
        barWidth: 50,
        emptyDefaultTitle:'没有数据',
        emptyDefaultColor:'rgba(200,200,200,1)',
        onEndShouldRate:0.2,
        emptyDefaultFontSize:15,

        barTriangleColor:'#c8c8c8',
        barTriangleSize:6,
        barContentStyle:{
            borderBottomWidth:1,
            borderBottomColor:'rgba(240,240,240,1)',
            backgroundColor: 'white',
        },
        barTextStyle:{
            color:'#5a5a5a',
            fontSize:15
        },
        barTextSelectStyle:{
            color:'black',
            fontSize:15
        },
        barItemTextStyle:{
            color:'#333333',
            fontSize:15,
            marginLeft:20
        },
        barItemFooterStyle:{
            height:10,
            borderBottomWidth:1,
            borderBottomColor:'rgba(200,200,200,1)'
        },
        barItemSeparatorStyle:{
            height:1,
            backgroundColor:'rgba(240,240,240,1)'
        },
        barCursorColor:'rgba(258,88,28,1)',
        barCursorHeight:1
    }

    constructor(props) {
        super(props)
        this.state = {
            refreshHeader: false,
            fHeight: 0,//flatList高度,
            fWidth:0,
            fY:0,
            showFixBar: false,
            ds: [],
            headerHeight: 0,
            isTop: false,
            fixedBarOpacity:0,
            isLoading:false//首次加载等待
        };
        this.cacheData=[];
        this.index = 0;
        this.barItemIndex = 0;
        this.scrollOffy = [];
        this.top = 0;
        this.barTop = 0;
        this.barItemIndexCache = [];
    }

    componentWillMount() {
        for (var i = 0; i < this.props.barTitles.length; i++) {
            this.cacheData.push([]);
            this.scrollOffy.push(0);
            this.barItemIndexCache.push(0);
        }
    }

    componentDidMount() {
        this._onReqData();
    }

    addData = (data) => {
        var tmp = this.cacheData[this.index];
        tmp = tmp.concat(data);
        this.setState({
            ds: tmp
        })
        this.cacheData[this.index] = tmp;
    }
    setData = (data) => {
        this.cacheData[this.index] = data;

        this.setState({
            ds: data,
            isLoading:false
        })
    }
    endRefreshFooter = () => {
        this.refs.footer.endRefresh()
    }
    endRefreshNomore = () => {
        this.refs.footer.endRefreshNomore()
    }
    _onReqData = () => {
        this.setState({
            isLoading:true
        });
        this.props.onReqData(this.index,this.barItemIndex);
    }
    _clickTabBar = (index,itemIndex) => {
        if (this.props.onClickBar){
            this.props.onClickBar(index,itemIndex);
        }
        if (index != this.index || itemIndex != this.barItemIndex){
            this.endRefreshFooter();
        }

        this.index = index;
        this.barItemIndex = itemIndex;

        this.barfixed.setIndex(this.index);
        this.bar.setIndex(this.index);

        if (this.cacheData[index].length == 0 || this.barItemIndexCache[index] != itemIndex) {
            this._onReqData();
        } else {
            this.setData(this.cacheData[index]);
            if (this.state.isTop){
                this.flat.scrollToOffset({offset:this.scrollOffy[this.index],animated:false})
            }
        }
        this.barItemIndexCache[index] = itemIndex;
    }

    _getBarTop = () => {
        return this.barTop;
    }
    _checkTopBar = () => {
        const handle = findNodeHandle(this.bar);
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {

            if (pageY-this.props.tabFloatTop <= 0) {
                if (this.state.isTop == false) {
                    this.setState({
                        isTop: true
                    });
                    for (var i = 0; i < this.scrollOffy.length; i++){
                        this.scrollOffy[i] = this.state.headerHeight;
                    }
                }
                this.barTop = this.props.tabFloatTop;
            } else {
                if (this.state.isTop == true) {
                    this.setState({
                        isTop: false
                    })

                }
                this.barTop = pageY;
            }
        });
    }
    _setFooter = (e) => {
        if (this.props.onBeginRefreshFooter) {
            var state = this.refs.footer.getRefreshState();
            if (state != 0) {
                return;
            }
            let scrollY = e.nativeEvent.contentOffset.y;
            let contentHeight = e.nativeEvent.contentSize.height;
            if (contentHeight == 0 || scrollY <= 0) {
                return;
            }
            if (scrollY + this.state.fHeight > contentHeight - this.state.fHeight * this.props.onEndShouldRate) {
                this._onDidRefreshFooter()
            }
        }
    }
    _onScroll = (e) => {
        if (this.props.onListScroll) {
            this.props.onListScroll(e);
        }
        this.scrollOffy[this.index] = e.nativeEvent.contentOffset.y;
        this._checkTopBar();
        this._setFooter(e);
    }

    _onDidRefreshFooter = () => {
        this.refs.footer.didRefresh()
        this.props.onBeginRefreshFooter();
    }
    _render_header = () => {
        var header = null;
        if (this.props.headerComponent) {
            header = this.props.headerComponent();
        }
        return (
            <View>
                <View onLayout={e => {
                    let height = e.nativeEvent.layout.height;
                    if (this.state.headerHeight < height) {
                        this.setState({headerHeight: height})
                        this.barTop = height+this.props.tabFloatTop;
                    }
                }}>
                    {header}
                </View>

                {this._render_bar()}
            </View>
        )

    }
    _render_footer = () => {
        return (
            <SFTabFooter ref="footer"/>
        )
    }
    _keyExtractor = (item, index) => 'flcell_' + index;

    _render_bar = () => {
        return (
            <SFTabBar
                ref={(ref)=> {
                    this.bar = ref
                }}
                barShow={true}
                getBarTop={this._getBarTop}
                barItemTextStyle={this.props.barItemTextStyle}
                barItemFooterStyle={this.props.barItemFooterStyle}
                barItemSeparatorStyle={this.props.barItemSeparatorStyle}
                barTriangleColor={this.props.barTriangleColor}
                barTriangleSize={this.props.barTriangleSize}
                barContentStyle={this.props.barContentStyle}
                barTextStyle={this.props.barTextStyle}
                barTextSelectStyle={this.props.barTextSelectStyle}
                barHeight={this.props.barHeight}
                barWidth={this.props.barWidth}
                barTitles={this.props.barTitles}
                width={this.state.fWidth}
                cursorColor={this.props.barCursorColor}
                cursorHeight={this.props.barCursorHeight}
                clickBar={this._clickTabBar}
            />
        )
    }
    _render_fix_bar = () => {
        return (
            <SFTabBar
                ref={(ref)=> {
                    this.barfixed = ref
                }}
                barShow={this.state.isTop}
                getBarTop={this._getBarTop}
                barItemTextStyle={this.props.barItemTextStyle}
                barItemFooterStyle={this.props.barItemFooterStyle}
                barItemSeparatorStyle={this.props.barItemSeparatorStyle}
                barTriangleColor={this.props.barTriangleColor}
                barTriangleSize={this.props.barTriangleSize}
                barContentStyle={this.props.barContentStyle}
                barTextStyle={this.props.barTextStyle}
                barTextSelectStyle={this.props.barTextSelectStyle}
                barWidth={this.props.barWidth}
                barHeight={this.props.barHeight}
                barTitles={this.props.barTitles}
                fixed={true}
                width={this.state.fWidth}
                cursorColor={this.props.barCursorColor}
                cursorHeight={this.props.barCursorHeight}
                clickBar={this._clickTabBar}
            />
        )
    }
    _renderEmptyContent = () => {
        if (this.state.isLoading){
            return(
                <ActivityIndicator style={{
                    marginTop:30
                }} size="small" color={this.props.emptyDefaultColor} />
            )
        }
        if (this.props.emptyComponent) {
            return this.props.emptyComponent;
        } else {
            return (
                <Text style={{
                    color: this.props.emptyDefaultColor,
                    fontSize: this.props.emptyDefaultFontSize,
                    marginTop:30,
                }}>{this.props.emptyDefaultTitle}</Text>
            )
        }
    }
    _renderEmpty = () => {
        return (
            <View style={{
                alignItems:'center',
                height:this.state.fHeight,
            }}>
                {this._renderEmptyContent()}
            </View>
        )
    }

    render() {
        return (
            <View ref={(ref)=>{this.view = ref}} style={{flex: 1}}>
                <FlatList
                    ListHeaderComponent={this._render_header()}
                    ListFooterComponent={this._render_footer()}
                    ListEmptyComponent = {this._renderEmpty()}
                    initialNumToRender={20}
                    ref={(ref)=>{this.flat = ref}}
                    {...this.props}
                    onScroll={this._onScroll}
                    keyExtractor={this._keyExtractor}
                    data={this.state.ds}
                    onLayout={e => {
                        let height = e.nativeEvent.layout.height;
                        let width = e.nativeEvent.layout.width;
                        if (this.state.fHeight < height) {
                            this.setState({fHeight: height-this.props.tabFloatTop,fWidth:width})
                        }}}
                />

                {this._render_fix_bar()}

            </View>

        )
    }

}