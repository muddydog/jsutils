//将unicode编码转字符串

var Unicode_Str=function(unicode){

    var result=[];

    var strArr=unicode.split('\\u');

    for(var i=0,len=strArr.length;i<len;i++){

        if(strArr[i]){

            result.push(string.fromCharCode(parseInt(strArr[i],16)))

        }

    }

    return result.join('');

}

//将字符串转unicode编码

var Str_Unicode=function(str){

    var unid='\\u';

    for(let i=0,len=str.length;i<len;i++){

        if(i<len-1){

            unid+=str.charCodeAt(i).toString(16)+'\\u';

        }else if(i===len-1){

            unid+=str.charCodeAt(i).toString(16);

        }

    }

    return unid;

}
