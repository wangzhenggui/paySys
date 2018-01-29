import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, PanResponder,Image} from 'react-native';
import AllServInfo from '../testData'
// import Icon from 'react-native-vector-icons/Ionicons';


const viewWidth = Dimensions.get('window').width;
const margLeft = (viewWidth - 300) / 4
const itemHeight = 50
const itemWidth = 100
const itemTop = 10
const colNum = 3
const subHeight = 80
var items = []
export default class MoveDemo extends Component<{}> {

  constructor(props) {
    super(props);
    this.mappingItems = ['客户信息','当前故障','当前投诉','业务开通','业务性能'];
    this.order = ['客户信息','当前故障','当前投诉','业务开通','业务性能'];
    this.state = {
      isManage : false,
      manageName:"管理",
      viewSize:this.order.length
    }

  }

// componentDidMount() {
//   console.log(items);
// }
 componentWillUpdate() {
   this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: (evt, gestureState) => true,
     onMoveShouldSetPanResponder: (evt, gestureState) => true,
     // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
     onPanResponderGrant: (evt, gestureState) => {
              const {pageX,locationX,pageY,locationY} = evt.nativeEvent;
              //pageX 在最外层的视图中的坐标
              //locationX  相对于本身移动的位置
             // gestureState.{x,y}0 现在会被设置为0
              this.currentPageId = this._getIdByPosition(pageX,pageY);
              this.preY = pageY - locationY - subHeight;
              this.preX = pageX - locationX;
              this._dealNullItem();
              let item = items[this.currentPageId];
                item.setNativeProps({
                  //被移动的item的样式改变，要突出显示
                    style: {
                        elevation: 5,
                        backgroundColor:'yellow'
                    }
                });
           },
     onPanResponderMove: (evt, gestureState) => {
          let top = this.preY + gestureState.dy;
          let left = this.preX + gestureState.dx;
          let item = items[this.currentPageId];
          item.setNativeProps({
              style: {top: top,left:left}
          });
           let collideIndex = this._getIdByPosition(evt.nativeEvent.pageX,evt.nativeEvent.pageY);  //获取当前的位置上item的id
           // console.log("X:" + evt.nativeEvent.pageX + "Y:" + evt.nativeEvent.pageY + "item:" + collideIndex);
          if(collideIndex !== this.currentPageId && collideIndex !== -1) {          //判断是否和手上的item的id一样
                   let collideItem = items[collideIndex];
                   collideItem.setNativeProps({
                       style: {top: this._getTopByPosition(this.currentPageId),
                              left:this._getLeftByPosition(this.currentPageId)
                            }         //将collideItem的位置移动到手上的item的位置
                   });
                   [items[this.currentPageId], items[collideIndex]] = [items[collideIndex], items[this.currentPageId]];
                   [this.order[this.currentPageId], this.order[collideIndex]] = [this.order[collideIndex], this.order[this.currentPageId]];
                   this.currentPageId = collideIndex;
          }
      },

    onPanResponderRelease:(evt, gestureState) => {
      const shadowStyle = {
                    elevation: 0,
                    backgroundColor:'green'
                };
              let item = items[this.currentPageId];
               //go back the correct position
              item.setNativeProps({
                   style: {...shadowStyle, top: this._getTopByPosition(this.currentPageId),left:this._getLeftByPosition(this.currentPageId)}
               });
                console.log("移动完成："+this.order);
    }
   })
 }

 componentDidUpdate() {
   // console.log(items);
  this._dealNullItem();
   items.map((item,i)=>{
     item.setNativeProps({
         style: {top: this._getTopByPosition(i),
                left:this._getLeftByPosition(i)
              }         //将collideItem的位置移动到手上的item的位置
     });
   })
 }

 //获取当前移动的是第几个元素
 _getIdByPosition(pageX,pageY){
    let postionPageY =  pageY - subHeight;  //TODO 减去这个View上面的高度在进行计算
    var id = -1;
    if(pageX >= margLeft && pageX <= (itemWidth + margLeft))
        id = 0;
    else if(pageX >= itemWidth + 2 * margLeft && pageX <= (itemWidth + margLeft) * 2)
        id = 1;
    else if(pageX >= itemWidth * 2 + 3 * margLeft && pageX < (itemWidth + margLeft) * 3)
        id = 2;
    else {
      return -1;    //移动到不在区域内的地区时不做任何处理
    }

    if(postionPageY >= itemTop && postionPageY <= (itemHeight + itemTop)) {
      id += 0;
    }else if(postionPageY >= itemHeight + 2 * itemTop && postionPageY <= (itemHeight + itemTop)*2) {
      id += 3;
    }else if(postionPageY >= itemHeight * 2 + 3 * itemTop && postionPageY <= (itemHeight + itemTop)*3) {
      id += 6;
    }else {
      return -1;    //移动到俩个方块之间的区域的时候不做任何处理
    }

    if(id > this.order.length - 1) {
      return -1;
    }
    return id;
  }

_getTopByPosition(i) {
  return (Math.floor(i / colNum) + 1) * itemTop + Math.floor(i / colNum) * itemHeight
}

_getLeftByPosition(i) {
  return (Math.floor(i % colNum) + 1) * margLeft + Math.floor(i % colNum) * itemWidth
}

_eventManagePress() {
  this.setState({
    isManage:!this.state.isManage,
    manageName: this.state.manageName == "管理" ? "完成" : "管理",
    viewSize:this.order.length
  })
}

//item除去null的选项
_dealNullItem() {
  var length = items.length;
    for(var i = 0; i < length; i++)
    {
        if(items[i] == null)
        {
            if(i == 0)
            {
                items.shift(); //删除并返回数组的第一个元素
                return;
            }
            else if(i == length-1)
            {
                items.pop();  //删除并返回数组的最后一个元素
                return;
            }
            else
            {
                items.splice(i,1); //删除下标为i的元素
                return;
            }
        }
    }
}

  render() {
    return(
      <View style={styles.contain}>
        <View style={styles.pagetitles}>
          <Image source={require('../images/reback.png')} />
          <Text style={{color:'white',fontSize:18}}>更多功能</Text>
          <Text style={{color:'white',fontSize:15}} onPress={this._eventManagePress.bind(this)} >{this.state.manageName}</Text>
        </View>
        <View style={styles.smalltitle}>
          <Text style={{color:'blue',fontSize:16}}>首页应用</Text>
        </View>
        <View style={[styles.indexapp,{height:(Math.floor(this.order.length  / colNum) + 1) * (itemHeight + itemTop)}]}>
          {this.getMoveView()}
        </View>
        <View style={styles.smalltitle}>
          <Text style={{color:'blue',fontSize:16}}>全部应用</Text>
        </View>
        <View style={styles.allapplictionStyle}>
          {this.getAllApplication()}
        </View>
      </View>
    )
  }

  getMoveView() {
    let cbMoveViewArr = [];
    this.order.map((item,i)=>{
      console.log("setState方法调用："+item);      //TODO
      let moveIcon = this.state.isManage ? <TouchableOpacity onPress={this._subIconPress.bind(this, item)}><Image source={require('../images/sub.png')} /></TouchableOpacity> : null
      var positionStyle={
        top:this._getTopByPosition(i),
        left:this._getLeftByPosition(i)
      }
      let component = this.state.isManage ? (<View {...this._panResponder.panHandlers} viewName={item} ref={(ref) => items[i] = ref} key={i} style={[styles.innerViewStyle,positionStyle]}><View style={styles.moveiconStyle}>{moveIcon}</View><Text>{item}</Text></View>) :  (<View viewName={item} ref={(ref) => items[i] = ref} key={i} style={[styles.innerViewStyle,positionStyle]}><View style={styles.moveiconStyle}>{moveIcon}</View><Text>{item}</Text></View>)
       // let component = this.state.isManage ? (<View {...this._panResponder.panHandlers}  ref={(ref) => {(items[i] = (items[i] === undefined) ?ref:items[i])}} key={i} style={[styles.innerViewStyle,positionStyle]}><View style={styles.moveiconStyle}>{moveIcon}</View><Text>{item}</Text></View>) :  (<View ref={(ref) => {(items[i] = (items[i] === undefined) ?ref:items[i])}} key={i} style={[styles.innerViewStyle,positionStyle]}><View style={styles.moveiconStyle}>{moveIcon}</View><Text>{item}</Text></View>)
      cbMoveViewArr.push(
        component
      );
    })
    return cbMoveViewArr
  }

  _addIconPress(addContext) {
    //排序数组增加
    this.order.push(addContext);
    console.log("增加之后的Order：" + this.order);
    //stateNames增加
    let stateNamesArr = [...this.order];

    //items初始位置增加
    this.mappingItems.push(addContext);

    this.setState({
      viewSize:this.order.length
    });
  }

  _subIconPress(subContext) {
    //排序数组删除
    let orderIndex;
    this.order.map((ord,i)=>{
      if(ord == subContext) {
        orderIndex = i;
      }
    })
    this.order.splice(orderIndex,1);

    let stateNamesArr = [...this.order];
    console.log("删除之后的Order：" + this.order);
    // this._testDeleteItem(subContext);    //TODO   此处删除一个Item
    this.setState({
      viewSize:this.order.length
    });
  }

  getAllApplication() {
    var cbAllViewArr = [];
    AllServInfo.data.map((item,i)=>{
      let allAppIconSub = this.state.isManage ? <TouchableOpacity onPress={this._subIconPress.bind(this, item.text)}><Image source={require('../images/sub.png')} /></TouchableOpacity> : null
      let allAppIconAdd = this.state.isManage ? <TouchableOpacity onPress={this._addIconPress.bind(this, item.text)}><Image source={require('../images/add.png')} /></TouchableOpacity> : null
      let tmp = null;
      if(this.order.indexOf(item.text) > -1) {
        tmp = allAppIconSub
      }else {
        tmp = allAppIconAdd
      }
      cbAllViewArr.push(
        <View key={i++} style={styles.application}>
          <View style={styles.moveiconStyle}>{tmp}</View>
          <Text>{item.text}</Text>
        </View>
      );
    })
    return cbAllViewArr;
  }
}

const styles = StyleSheet.create({
  contain:{
    flex:1,
    width:viewWidth,
    backgroundColor:'#cdf',
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center'
  },
  pagetitles:{
    width:viewWidth,
    height:50,
    backgroundColor:'blue',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  indexapp:{
    width:viewWidth,
    // height:150,
    backgroundColor:'#cdf',
  },
  innerViewStyle:{
    width:itemWidth,
    height:itemHeight,
    backgroundColor:'green',
    alignItems:'center',
   position: 'absolute',
 },
 moveiconStyle:{
   width:itemWidth,
   height:15,
   flexDirection:'row',
   justifyContent:'flex-end',
   paddingRight:5,
   paddingTop:3
 },
 smalltitle:{
   width:viewWidth,
   height:30,
   marginLeft:margLeft,
   justifyContent:'center'
 },
 allapplictionStyle:{
    width:viewWidth,
    height:250,
    flexDirection:'row',
    alignItems:'center',
    flexWrap:'wrap',
 },
 application:{
   width:itemWidth,
   height:itemHeight,
   backgroundColor:'green',
   // justifyContent:'center',
   alignItems:'center',
   marginLeft:margLeft,
   marginTop:itemTop
 }
});
