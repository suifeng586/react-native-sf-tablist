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
    UIManager,
    TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import SFTabBarTable from "./SFTabBarTable"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width;

export default class SFTabList extends Component {
    static propTypes = {
        barHeight: PropTypes.number,
        barWidth: PropTypes.number,
        barTitles: PropTypes.array.isRequired,
        clickBar: PropTypes.func.isRequired,
        width: PropTypes.number.isRequired,
        getBarTop: PropTypes.func.isRequired,
        barTextStyle: PropTypes.any,
        barTextSelectStyle: PropTypes.any,
        barContentStyle: PropTypes.any,
        barTriangleColor: PropTypes.string,
        barTriangleSize: PropTypes.number,
        barItemTextStyle: PropTypes.any,
        barItemFooterStyle: PropTypes.any,
        barItemSeparatorStyle: PropTypes.any,
        barShow: PropTypes.bool
    }
    static defaultProps = {
        barHeight: 40,
        barWidth: 50,
        fixed: false,

    }

    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            itemIndexs: [],
            showBarItem: false
        }
    }

    componentWillMount() {
        for (var i = 0; i < this.props.barTitles.length; i++) {
            this.state.itemIndexs.push(0);
        }
    }

    componentDidMount() {

    }

    setIndex = (index) => {
        if (this.state.index == index) {
            return;
        }
        this.setState({
            index: index
        })
    }
    clickBar = (index) => {
        var title = this.props.barTitles[index];
        this.setState({
            index: index
        })
        if (title instanceof Array) {
            var barTop = this.props.getBarTop();
            this.barTable.show(title, barTop + this.props.barHeight + 1);
            this.setState({
                showBarItem: true
            })
        } else {
            if (this.props.clickBar) {
                this.props.clickBar(index, 0);
            }
        }
    }
    _itemBarOnHide = () => {
        this.setState({
            showBarItem: false
        })
    }
    _clickBarItem = (index) => {
        var tmp = this.state.itemIndexs.concat();
        tmp[this.state.index] = index;
        this.setState({
            itemIndexs: tmp
        })
        if (this.props.clickBar) {
            this.props.clickBar(this.state.index, index);
        }
    }
    _getBgColor = () => {
        return this.props.barContentStyle.backgroundColor?this.props.barContentStyle.backgroundColor:'white';
    }
    render_triangle = (value) => {
        if (value) {
            var marginTop = 0;
            var top = this._getBgColor();
            var left = this._getBgColor();
            var bottom = this._getBgColor();
            var right = this._getBgColor();
            if (this.state.showBarItem) {
                bottom = this.props.barTriangleColor;
                marginTop = this.props.barTriangleSize;
            } else {
                top = this.props.barTriangleColor;
                marginTop = -this.props.barTriangleSize;
            }
            return (
                <View style={{
                    marginLeft: 5,
                    marginTop: marginTop,
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: this.props.barTriangleSize,
                    borderTopColor: bottom,//下箭头颜色
                    borderLeftColor: right,//右箭头颜色
                    borderBottomColor: top,//上箭头颜色
                    borderRightColor: left//左箭头颜色
                }}>

                </View>
            )
        }
    }

    render() {
        var barStyle = null;
        var opacity = 0;
        if (this.props.barShow) {
            opacity = 1;
        }
        if (this.props.fixed) {
            barStyle = {
                position: 'absolute',
            }
        }
        var ary = [];
        for (var i = 0; i < this.props.barTitles.length; i++) {
            var textStyle = this.props.barTextStyle;
            if (i == this.state.index) {
                textStyle = this.props.barTextSelectStyle;
            }
            var isMul = false;
            var title = this.props.barTitles[i];
            if (title instanceof Array) {
                title = title[this.state.itemIndexs[i]];
                isMul = true;
            }
            ary.push(
                <TouchableWithoutFeedback key={i} onPress={this.clickBar.bind(this, i)}>
                    <View style={{
                        height: this.props.barHeight,
                        width: this.props.barWidth,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text style={textStyle}>
                            {title}
                        </Text>
                        {this.render_triangle(isMul)}
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return (
            <ScrollView
                style={[{
                    opacity: opacity,
                    width: this.props.width,
                }, barStyle, this.props.barContentStyle]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {ary}
                <SFTabBarTable
                    ref={(ref)=> {
                        this.barTable = ref
                    }}
                    textStyle={this.props.barItemTextStyle}
                    footerStyle={this.props.barItemFooterStyle}
                    separatorStyle={this.props.barItemSeparatorStyle}
                    clickBarItem={this._clickBarItem}
                    onHide={this._itemBarOnHide}
                />
            </ScrollView>
        )
    }
}