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
    TouchableWithoutFeedback,
    Modal
} from 'react-native'
import PropTypes from 'prop-types'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').width;

export default class SFTabBarTable extends Component {
    static propTypes = {
        clickBarItem:PropTypes.func.isRequired,
        onHide:PropTypes.func.isRequired,
        textStyle:PropTypes.any,
        footerStyle:PropTypes.any,
        separatorStyle:PropTypes.any,
    }
    static defaultProps = {


    }

    constructor(props) {
        super(props)
        this.state = {
            ds:[],
            isShow:false,
            top:0,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }
    show = (data,top) => {
        this.setState({
            ds:data,
            isShow:true,
            top:top
        })
    }
    hide = () => {
        this.setState({
            isShow:false
        })
        this.props.onHide()
    }
    clickBar = (index) => {
        this.hide();
        if (this.props.clickBarItem){
            this.props.clickBarItem(index);
        }
    }
    _keyExtractor = (item, index) => 'flcell_' + index;
    _renderItem = ({item,index}) =>{
        return(
            <TouchableWithoutFeedback onPress={this.clickBar.bind(this,index)}>
                <View style={{
                    width:width,
                    justifyContent:'center',
                    padding:10
                }}>
                    <Text style={this.props.textStyle}>
                        {item}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    _renderSepara = () => {
        return(
            <View style={this.props.separatorStyle}>

            </View>
        )
    }
    _renderFooter = () => {
        return(
            <View style={this.props.footerStyle}>

            </View>
        )
    }
    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.isShow}
                presentationStyle="overFullScreen"
                onRequestClose={this.hide}
            >
                <TouchableWithoutFeedback onPress={this.hide}>
                <View style={{
                    position:'absolute',
                    left:0,
                    top:0,
                    bottom:0,
                    right:0,
                }}>

                    </View>
                    </TouchableWithoutFeedback>
                <FlatList
                    style={{
                        position:'absolute',
                        left:0,
                        top:this.state.top,
                        backgroundColor:'white'
                    }}
                    keyExtractor={this._keyExtractor}
                    data={this.state.ds}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    ItemSeparatorComponent={this._renderSepara}
                />
            </Modal>
        )
    }
}