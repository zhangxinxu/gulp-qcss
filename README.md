# gulp-qcss
write css quickly as rocket!

## Use example

<pre>
var gulp = require('gulp');

var qcss = require('gulp-qcss');

gulp.task('default', function () {
    gulp.src('src/test.qcss')
        .pipe(qcss())
        .pipe(gulp.dest('dist/'));
});
</pre>

will change this:

<pre>
.clear{cl}.center{tc;}.hidden{dn;}hr{dn;}
.ml2{ml2}.ml5{ml5;}.ml10{ml10;}.m5{m5;}
.imgpad{p3; bd#ccc;}
.f11{f1.1em;}.f12{f1.2em;}
#link{
bg#f5f5f5;
bdl5 s #ccc;
f13; p4 0 4 8;}
.params_table{bg#a0b3d6; f12;}
.params_table th{bg#f0f3f9; bd3 s #fff; tc}
.params_table td{bgc#f9f9f9; p2 4; bd3 s #fff;}
.params_table tr:hover{op.9;}
span.s{f0.9em; c#999;}
h2.pagetitle {mt30;tc;}h3{p0;m30 0 0;n}.entry h3{mt18}h3{f1.3em;}
body.category h3{f1.5em; mt10;}
.zxx_code{p10; m5 0; f12; bg#eeeeee; bd1 d #ccc; cl; z1;}
.zxx_code pre{m0; c#00F; prew; bkw;}
img.centered {db;mla;mra;}
img.alignright {p4;m0 0 2 7;di;	}img.alignleft {p4;m0 7 3 0;di;}
.alignright {l;}.alignleft {r;}
p{p8 0; m0;}
.a_link{tdl;tsl op .2s;}.a_link:hover{c#f30; tdn;}
img{bd0;}.vimg{mb-3;}
code{br3; p0 4; font-family: 'Microsoft yahei';}
@media all and (max-width:320px) {
.da_inner{w calc(100vw - 24px);}
.top_da{h262;}
.top_da_out::before{dn}
}
</pre>

to this:

<pre>.clear{clear: both}.center{text-align: center;}.hidden{display: none;}hr{display: none;}
.ml2{margin-left: 2px}.ml5{margin-left: 5px;}.ml10{margin-left: 10px;}.m5{margin: 5px;}
.imgpad{padding: 3px; border: #ccc;}
.f11{font-size: 1.1em;}.f12{font-size: 1.2em;}
#link{background: #f5f5f5; border-left: 5px solid #ccc; font-size: 13px; padding: 4px 0 4px 8px;}
.params_table{background: #a0b3d6; font-size: 12px;}
.params_table th{background: #f0f3f9; border: 3px solid #fff; text-align: center}
.params_table td{background-color: #f9f9f9; padding: 2px 4px; border: 3px solid #fff;}
.params_table tr:hover{opacity: .9;}
span.s{font-size: 0.9em; color: #999;}
h2.pagetitle {margin-top: 30px; text-align: center;}h3{padding: 0; margin: 30px 0 0; font-weight: normal; font-style: normal}.entry h3{margin-top: 18px}h3{font-size: 1.3em;}
body.category h3{font-size: 1.5em; margin-top: 10px;}
.zxx_code{padding: 10px; margin: 5px 0; font-size: 12px; background: #eeeeee; border: 1px dashed #ccc; clear: both; zoom: 1;}
.zxx_code pre{margin: 0; color: #00F; white-space: pre-wrap; word-wrap: break-word;}
img.centered {display: block; margin-left: auto; margin-right: auto;}
img.alignright {padding: 4px; margin: 0 0 2px 7px; display: inline;}img.alignleft {padding: 4px; margin: 0 7px 3px 0; display: inline;}
.alignright {float: left;}.alignleft {float: right;}
p{padding: 8px 0; margin: 0;}
.a_link{text-decoration: underline; translation: opacity .2s;}.a_link:hover{color: #f30; text-decoration: none;}
img{border: 0;}.vimg{margin-bottom: -3px;}
code{border-radius: 3px; padding: 0 4px; font-family: 'Microsoft yahei';}
@media all and (max-width:320px) {
.da_inner{width: calc(100vw - 24px);}
.top_da{height: 262px;}
.top_da_out::before{display: none}
}</pre>

