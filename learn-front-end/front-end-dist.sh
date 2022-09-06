#!/bin/bash

# shell配置文件
file_cfg="$0.cfg"

# 当前执行目录
dir_src=`pwd`
dir_src="${dir_src//\\//}"	# ensure '\' is '/'

echo ''
echo '> shell file path' : $0
echo '> current workspace path' : ${dir_src}

# 检查是否为目标类型文件夹
# 
# dst_name=`git remote -v | sed -n 1p | egrep -o "learn-front-end(.+?).git"`
# # dst_name=${dst_name#learn-front-end}
# dst_name=${dst_name%%.git}
# echo "> current project git name : " ${dst_name}
# 
dst_folder=`echo "${dir_src}" | egrep -o "heima2022.*"`

# fix
dst_name="${dst_folder##*/}"
dst_folder="${dst_folder%/*}"
dst_folder="${dst_folder:10}"

if [ -z "${dst_folder}" ] || [ -z "${dst_name}" ]; then
	echo '>> exit: current workspace is not a learn-front-end/itheima2022 sub folder'
	echo ''
	exit
fi

if [ ! -e "${dir_src}/index.html" ]; then
	echo '>> exit: index.html not eixsts'
	echo ''
	exit
fi

# 读取配置文件
if [ -e "${file_cfg}" ]; then
	cfg_root=`cat "${file_cfg}"`
fi

# 检查目录有效性
checked=0
while ([ -z "${cfg_root}" ] || [ ! -d "${cfg_root}" ]); do

	if [ $checked = 0 ]; then
		echo '> Readed project path not exists at' : "${cfg_root}"
		checked=1
	fi
	
	read -p "Enter tsinglee2009.io project path : " cfg_root

	if [ "${cfg_root}" = "exit" ]; then
		break
	fi
done

if [ $checked = 1 ]; then
	echo ${cfg_root} > "${file_cfg}"
fi

echo '> tsinglee2009.io project path' : "${cfg_root}"

# 目标webpage目录
dir_dst="${cfg_root}/learn-front-end/${dst_folder}"

# 拷贝项目前提示
echo ' '
echo '> copy directory :'
echo '>           from : '"${dir_src}"
echo '>           to   : '"${dir_dst}/${dst_name}"
echo ' '

read -p "Copy ? (y/n) : " confirm

if [ "${confirm}" = "y" ]; then

	# 检查文件夹是否存在
	if [ -d "${dir_dst}" ]; then
		# 若存在，更新至最新
		git pull
		rm -rf "${dir_dst}"
	fi

	# 清空目标文件夹
	mkdir -p "${dir_dst}"
	
	# 执行拷贝
	cp -rf "${dir_src}" "${dir_dst}"/"${dst_name}"

	# 执行提交
	cd "${cfg_root}"
	git add "${dir_dst}"/"${dst_name}"/*
	git commit -m "distribute '${dir_dst}/${dst_name}'"
	git push origin main

	cd "${dir_src}"
	
	echo ''
	echo distribute ${dst_folder}/${dst_name} completed
	echo ''
else
	echo ''
	echo 'copy canceled, exit ...'
	echo ''
fi
