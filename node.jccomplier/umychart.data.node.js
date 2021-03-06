/*
    开源项目 https://github.com/jones2000/HQChart
    
    行情数据结构 及计算方法
*/

//历史K线数据
function HistoryData()
{
    this.Date;
    this.YClose;
    this.Open;
    this.Close;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.Time;
}

//数据复制
HistoryData.Copy=function(data)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose;
    newData.Open=data.Open;
    newData.Close=data.Close;
    newData.High=data.High;
    newData.Low=data.Low;
    newData.Vol=data.Vol;
    newData.Amount=data.Amount;
    newData.Time=data.Time;

    return newData;
}

//数据复权拷贝
HistoryData.CopyRight=function(data,seed)
{
    var newData=new HistoryData();
    newData.Date=data.Date;
    newData.YClose=data.YClose*seed;
    newData.Open=data.Open*seed;
    newData.Close=data.Close*seed;
    newData.High=data.High*seed;
    newData.Low=data.Low*seed;

    newData.Vol=data.Vol;
    newData.Amount=data.Amount;

    return newData;
}

//分钟数据
function MinuteData()
{
    this.Close;
    this.Open;
    this.High;
    this.Low;
    this.Vol;
    this.Amount;
    this.DateTime;
    this.Increate;
    this.Risefall;
    this.AvPrice;
}

//单指标数据
function SingleData()
{
    this.Date;  //日期
    this.Value; //数据
}


//////////////////////////////////////////////////////////////////////
// 数据集合
function ChartData()
{
    this.Data=new Array();
    this.DataOffset=0;                        //数据偏移
    this.Period=0;                            //周期 0 日线 1 周线 2 月线 3年线
    this.Right=0;                             //复权 0 不复权 1 前复权 2 后复权

    this.Data2=new Array();                   //第1组数据 走势图:历史分钟数据

    this.GetCloseMA=function(dayCount)
    {
        var result=new Array();
        for (var i = 0, len = this.Data.length; i < len; i++)
        {
            if (i < dayCount)
            {
                result[i]=null;
                continue;
            }

            var sum = 0;
            for (var j = 0; j < dayCount; j++)
            {
                sum += this.Data[i - j].Close;
            }
            result[i]=sum / dayCount;
        }
        return result;
    }

    this.GetVolMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Vol;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    this.GetAmountMA=function(dayCount)
    {
    var result=new Array();
    for (var i = 0, len = this.Data.length; i < len; i++)
    {
        if (i < dayCount)
        {
            result[i]=null;
            continue;
        }

        var sum = 0;
        for (var j = 0; j < dayCount; j++)
        {
            sum += this.Data[i - j].Amount;
        }
        result[i]=sum / dayCount;
    }
    return result;
    }

    //获取收盘价
    this.GetClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Close;
        }

        return result;
    }

    this.GetYClose=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].YClose;
        }

        return result;
    }

    this.GetHigh=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].High;
        }

        return result;
    }

    this.GetLow=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Low;
        }

        return result;
    }

    this.GetOpen=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Open;
        }

        return result;
    }

    this.GetVol=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Vol;
        }

        return result;
    }

    this.GetAmount=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].Amount;
        }

        return result;
    }

    this.GetYear=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date/10000);
        }

        return result;
    }

    this.GetMonth=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=parseInt(this.Data[i].Date%10000/100);
        }

        return result;
    }

    this.GetMinutePeriodData=function(period)
    {
        var result = new Array();
        var periodDataCount = 5;
        if (period == 5)
            periodDataCount = 5;
        else if (period == 6)
            periodDataCount = 15;
        else if (period == 7)
            periodDataCount = 30;
        else if (period == 8)
            periodDataCount = 60;
        else
            return this.Data;
        var bFirstPeriodData = false;
        var newData = null;
        for (var i = 0; i < this.Data.length; )
        {
            bFirstPeriodData = true;
            for (var j = 0; j < periodDataCount && i < this.Data.length; ++i)
            {
                if (bFirstPeriodData)
                {
                    newData = new HistoryData();
                    result.push(newData);
                    bFirstPeriodData = false;
                }
                var minData = this.Data[i];
                if (minData == null)
                {
                    ++j;
                    continue;    
                } 
                if (minData.Time == 925 || minData.Time == 930 || minData.Time == 1300)
                    ;
                else
                    ++j;
                newData.Date = minData.Date;
                newData.Time = minData.Time;
                if (minData.Open==null || minData.Close==null)
                    continue;
                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=minData.Open;
                    newData.High=minData.High;
                    newData.Low=minData.Low;
                    newData.YClose=minData.YClose;
                    newData.Close=minData.Close;
                    newData.Vol=minData.Vol;
                    newData.Amount=minData.Amount;      
                }
                else
                {
                    if (newData.High<minData.High) 
                        newData.High=minData.High;
                    if (newData.Low>minData.Low) 
                        newData.Low=minData.Low;
                    newData.Close=minData.Close;
                    newData.Vol+=minData.Vol;
                    newData.Amount+=minData.Amount;
                }
            }
        }
        return result;
    }

    this.GetDayPeriodData=function(period)
    {
        var result=new Array();
        var index=0;
        var startDate=0;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];

            switch(period)
            {
                case 1: //周线
                    var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new HistoryData();
                newData.Date=dayData.Date;
                result.push(newData);

                if (dayData.Open==null || dayData.Close==null) continue;

                newData.Open=dayData.Open;
                newData.High=dayData.High;
                newData.Low=dayData.Low;
                newData.YClose=dayData.YClose;
                newData.Close=dayData.Close;
                newData.Vol=dayData.Vol;
                newData.Amount=dayData.Amount;
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Open==null || dayData.Close==null) continue;

                if (newData.Open==null || newData.Close==null)
                {
                    newData.Open=dayData.Open;
                    newData.High=dayData.High;
                    newData.Low=dayData.Low;
                    newData.YClose=dayData.YClose;
                    newData.Close=dayData.Close;
                    newData.Vol=dayData.Vol;
                    newData.Amount=dayData.Amount;
                }
                else
                {
                    if (newData.High<dayData.High) newData.High=dayData.High;
                    if (newData.Low>dayData.Low) newData.Low=dayData.Low;

                    newData.Close=dayData.Close;
                    newData.Vol+=dayData.Vol;
                    newData.Amount+=dayData.Amount;
                    newData.Date=dayData.Date;
                }
            }
        }

        return result;
    }

    //周期数据 1=周 2=月 3=年
    this.GetPeriodData=function(period)
    {
        if (period==1 || period==2 || period==3) return this.GetDayPeriodData(period);
        if (period==5 || period==6 || period==7 || period==8) return this.GetMinutePeriodData(period);
    }

    //复权  0 不复权 1 前复权 2 后复权
    this.GetRightDate=function(right)
    {
        var result=[];
        if (this.Data.length<=0) return result;

        if (right==1)
        {
            var index=this.Data.length-1;
            var seed=1; //复权系数
            var yClose=this.Data[index].YClose;

            result[index]=HistoryData.Copy(this.Data[index]);

            for(--index; index>=0; --index)
            {
                if (yClose!=this.Data[index].Close) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                yClose=this.Data[index].YClose;
            }

            for(; index>=0; --index)
            {
                if(yClose!=this.Data[index].Close)
                    seed *= yClose/this.Data[index].Close;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                yClose=this.Data[index].YClose;
            }
        }
        else if (right==2)
        {
            var index=0;
            var seed=1;
            var close=this.Data[index].Close;
            result[index]=HistoryData.Copy(this.Data[index]);

            for(++index;index<this.Data.length;++index)
            {
                if (close!=this.Data[index].YClose) break;
                result[index]=HistoryData.Copy(this.Data[index]);
                close=this.Data[index].Close;
            }

            for(;index<this.Data.length;++index)
            {
                if(close!=this.Data[index].YClose)
                    seed *= close/this.Data[index].YClose;

                result[index]=HistoryData.CopyRight(this.Data[index],seed);

                close=this.Data[index].Close;
            }
        }

        return result;
    }

    //叠加数据和主数据拟合,去掉主数据没有日期的数据
    this.GetOverlayData=function(overlayData)
    {
        var result=[];

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                result[i]=new HistoryData();
                result[i].Date=overlayData[j].Date;
                result[i].YClose=overlayData[j].YClose;
                result[i].Open=overlayData[j].Open;
                result[i].High=overlayData[j].High;
                result[i].Low=overlayData[j].Low;
                result[i].Close=overlayData[j].Close;
                result[i].Vol=overlayData[j].Vol;
                result[i].Amount=overlayData[j].Amount;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new HistoryData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }


    /*
        技术指标数据方法
    */
    //以主图数据 拟合,返回 SingleData 数组
    this.GetFittingData=function(overlayData)
    {
        var result=new Array();

        for(var i=0,j=0;i<this.Data.length;)
        {
            var date=this.Data[i].Date;

            if (j>=overlayData.length)
            {
                result[i]=null;
                ++i;
                continue;;
            }

            var overlayDate=overlayData[j].Date;

            if (overlayDate==date)
            {
                var item=new SingleData();
                item.Date=overlayData[j].Date;
                item.Value=overlayData[j].Value;
                result[i]=item;
                ++j;
                ++i;
            }
            else if (overlayDate<date)
            {
                ++j;
            }
            else
            {
                result[i]=new SingleData();
                result[i].Date=date;
                ++i;
            }
        }

        return result;
    }

    //把财报数据拟合到主图数据,返回 SingleData 数组
    this.GetFittingFinanceData = function (financeData)
    {
        var result = [];

        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;

            if (j + 1 < financeData.length) 
            {
                if (financeData[j].Date < date && financeData[j + 1].Date <= date) 
                {
                    ++j;
                    continue;
                }
            }

            var item = new SingleData();
            item.Date = date;
            item.Value = financeData[j].Value;
            item.FinanceDate = financeData[j].Date;   //财务日期 调试用
            result[i] = item;

            ++i;
        }

        return result;
    }

    //市值计算 financeData.Value 是股数
    this.GetFittingMarketValueData = function (financeData) 
    {
        var result = [];

        for (var i = 0, j = 0; i < this.Data.length;) 
        {
            var date = this.Data[i].Date;
            var price = this.Data[i].Close;

            if (j + 1 < financeData.length) 
            {
                if (financeData[j].Date < date && financeData[j + 1].Date <= date) 
                {
                    ++j;
                    continue;
                }
            }

            var item = new SingleData();
            item.Date = date;
            item.Value = financeData[j].Value * price;  //市值计算 收盘价*股数
            item.FinanceDate = financeData[j].Date;   //财务日期 调试用
            result[i] = item;

            ++i;
        }

        return result;
    }

    //月线数据拟合
    this.GetFittingMonthData = function (overlayData) {
      var result = new Array();

      var preDate = null;
      for (var i = 0, j = 0; i < this.Data.length;) {
        var date = this.Data[i].Date;

        if (j >= overlayData.length) {
          result[i] = null;
          ++i;
          continue;;
        }

        var overlayDate = overlayData[j].Date;

        if (overlayDate == date) {
          var item = new SingleData();
          item.Date = overlayData[j].Date;
          item.Value = overlayData[j].Value;
          item.Text = overlayData[j].Text;
          result[i] = item;
          ++j;
          ++i;
        }
        else if (preDate != null && preDate < overlayDate && date > overlayDate) {
          var item = new SingleData();
          item.Date = date;
          item.OverlayDate = overlayData[j].Date;
          item.Value = overlayData[j].Value;
          item.Text = overlayData[j].Text;
          result[i] = item;
          ++j;
          ++i;
        }
        else if (overlayDate < date) {
          ++j;
        }
        else {
          result[i] = new SingleData();
          result[i].Date = date;
          ++i;
        }

        preDate = date;
      }

      return result;
    }


    this.GetValue=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
          if (this.Data[i]==null || this.Data[i].Value == null)
          {
            result[i] = null;
          }
          else
          {
            // console.log(this.Data[i].Value);
            // console.log(i);
            if (!isNaN(this.Data[i].Value))
              result[i] = this.Data[i].Value;
            else if (this.Data[i].Value instanceof Array)   //支持数组
              result[i] = this.Data[i].Value;
            else
              result[i] = null;
          }
        }

        return result;
    }

    this.GetPeriodSingleData=function(period)
    {
        var result=new Array();
        var index=0;
        var startDate=0;
        var newData=null;
        for(var i in this.Data)
        {
            var isNewData=false;
            var dayData=this.Data[i];
            if (dayData==null || dayData.Date==null) continue;

            switch(period)
            {
                case 1: //周线
                    var fridayDate=ChartData.GetFirday(dayData.Date);
                    if (fridayDate!=startDate)
                    {
                        isNewData=true;
                        startDate=fridayDate;
                    }
                    break;
                case 2: //月线
                    if (parseInt(dayData.Date/100)!=parseInt(startDate/100))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
                case 3: //年线
                    if (parseInt(dayData.Date/10000)!=parseInt(startDate/10000))
                    {
                        isNewData=true;
                        startDate=dayData.Date;
                    }
                    break;
            }

            if (isNewData)
            {
                newData=new SingleData();
                newData.Date=dayData.Date;
                newData.Value=dayData.Value;
                result.push(newData);
            }
            else
            {
                if (newData==null) continue;
                if (dayData.Value==null || isNaN(dayData.Value)) continue;
                if (newData.Value==null || isNaN(newData.Value)) newData.Value=dayData.Value;
            }
        }

        return result;
    }

    /*
        分钟数据方法
        this.GetClose()     每分钟价格
        this.GetVol()       每分钟成交量
    */

    //分钟均线
    this.GetMinuteAvPrice=function()
    {
        var result=new Array();
        for(var i in this.Data)
        {
            result[i]=this.Data[i].AvPrice;
        }

        return result;
    }
}

ChartData.GetFirday=function(value)
{
    var date=new Date(parseInt(value/10000),(value/100%100-1),value%100);
    var day=date.getDay();
    if (day==5) return value;

    var timestamp=date.getTime();
    if (day<5)
    {
        var prevTimestamp=(24*60*60*1000)*(5-day);
        timestamp+=prevTimestamp;
    }
    else
    {
        var prevTimestamp=(24*60*60*1000)*(day-5);
        timestamp-=prevTimestamp;
    }

    date.setTime(timestamp);
    var fridayDate= date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();
    var week=date.getDay();
    return fridayDate;

}


//导出统一使用JSCommon命名空间名
module.exports =
{
    JSCommonData:
    {
        HistoryData: HistoryData,
        ChartData: ChartData,
        SingleData: SingleData,
        MinuteData: MinuteData
    },

    //单个类导出
    JSCommon_ChartData: ChartData,
    JSCommon_HistoryData: HistoryData,
    JSCommon_SingleData: SingleData,
    JSCommon_MinuteData: MinuteData
};