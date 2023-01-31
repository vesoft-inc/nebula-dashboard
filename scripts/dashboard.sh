#! /bin/bash

#set -o xtrace

function usage {
  echo "Usage: ${USAGE_INFO}"
}

[[ -z ${USAGE_INFO} ]] && USAGE_INFO="${0} [-v]  <start|stop|status｜restart> <prometheus|exporter|gateway|webserver|all>"

if [[ $# == 0 ]]; then
    usage
    exit 1
fi

# Original directory
OLD_DIR=$(pwd)
# Path to this script
SCRIPT_PATH=$(readlink -f $0)
# Directory of this script
SCRIPT_DIR=$(dirname ${SCRIPT_PATH})

ROOT_PATH=$(cd $SCRIPT_DIR/.. &>/dev/null; pwd)
UTILS_PATH=${SCRIPT_DIR}/utils.sh

cd $ROOT_PATH

[[ -f ${UTILS_PATH} ]] || ERROR_AND_EXIT "${UTILS_PATH} not exist"

source ${UTILS_PATH} || exit 1

function on_exit {
    cd ${OLD_DIR} &>/dev/null
}

trap on_exit EXIT

ACTION=
CONFIG=
DAEMON=
TARGET=
TARGETS=()
# VERSION=NEBULA_VERSION_TEMPLATE

# Parsing options from arguments
while getopts ":hc:" opt; do
  case $opt in
    h)
       usage
       exit 0
       ;;
    \?)
       ERROR "Invalid option: -${OPTARG}"
       ;;
     :)
       ERROR_AND_EXIT "Option -${OPTARG} requires an argument."
       ;;
  esac
done

shift $((OPTIND - 1))
if [[ $# != 2 ]]; then
    usage
    exit 1
fi

ACTION=${1}
TARGET=${2}

PROMETHEUS_BIN_PATH=${ROOT_PATH}/vendors/prometheus/prometheus
EXPORTER_BIN_PATH=${ROOT_PATH}/vendors/nebula-stats-exporter/nebula-stats-exporter
GATEWAY_BIN_PATH=${ROOT_PATH}/vendors/nebula-http-gateway/nebula-httpd
WEBSERVER_BIN_PATH=${ROOT_PATH}/bin/webserver

PID_PATH=${ROOT_PATH}/pids
PROMETHEUS_PID_FILE=${PID_PATH}/prometheus.pid
EXPORTER_PID_FILE=${PID_PATH}/nebula-stats-exporter.pid
GATEWAY_PID_FILE=${PID_PATH}/http-gateway.pid
WEBSERVER_PID_FILE=${PID_PATH}/webserver.pid

PROMETHEUS_DAEMON_NAME=prometheus
EXPORTER_DAEMON_NAME=nebula-stats-exporter
GATEWAY_DAEMON_NAME=http-gateway
WEBSERVER_DAEMON_NAME=nebula-dashboard-server


PROMETHEUS_LOG_FILE=prometheus.log
EXPORTER_LOG_FILE=nebula-stats-exporter.log
GATEWAY_LOG_FILE=http-gateway.log
WEBSERVER_LOG_FILE=webserver.log



case ${TARGET} in
    prometheus)
        TARGETS=(PROMETHEUS)
        ;;
    exporter)
        TARGETS=(EXPORTER)
        ;;
    webserver)
        TARGETS=(WEBSERVER)
        ;;
    gateway)
        TARGETS=(GATEWAY)
        ;;
    all)
        TARGETS=(PROMETHEUS GATEWAY WEBSERVER EXPORTER)
        ;;
    *)
        ERROR "Unknow daemon ${TARGET}"
        usage
        exit 1
esac

function start_daemon {
    local exepathname="${1}_BIN_PATH"
    local executable_file="${!exepathname}"   

    local daemonvarname="${1}_DAEMON_NAME"
    local daemon_name="${!daemonvarname}"
    
    [[ -e ${executable_file} ]] || ERROR_AND_EXIT "${executable_file} not found"
  
    local pidpathname="${1}_PID_FILE"
    local pid_file="${!pidpathname}"
    

    if [[ -f ${pid_file} ]]; then
      if is_process_running ${pid_file}; then
          ERROR "${daemon_name} already running: $(cat ${pid_file})"
          return 1
      fi
    fi

    local log_dir=logs
    local logpathname="${1}_LOG_FILE"
    local log_file="${!logpathname}"
    make_log_dir_if_absent ${log_dir} || ERROR_AND_EXIT "Failed to create ${log_dir}"
    local log_file_path=${ROOT_PATH}/${log_dir}/${log_file}
    
    if [[ ${1} == "EXPORTER" ]]; then
       local nebula_port=$(cat $ROOT_PATH/config.yaml| grep nebulaPort | awk '{print $2}')
       local command="nohup ${executable_file} --listen-address=:${nebula_port} --bare-metal --bare-metal-config=${ROOT_PATH}/vendors/nebula-stats-exporter/config.yaml > ${log_file_path} 2>&1 &"
    elif [[ ${1} == "PROMETHEUS" ]]; then
        local prometheusPort=$(cat $ROOT_PATH/config.yaml| grep prometheusPort | awk '{print $2}')
        local command="nohup ${executable_file} --web.listen-address=:${prometheusPort} --web.enable-lifecycle > ${log_file_path} 2>&1 &"
    else 
       local command="nohup ${executable_file} > ${log_file_path} 2>&1 &"
    fi
                                      
   
    INFO "Starting ${daemon_name}"
      
    make_pid_dir_if_absent ${ROOT_PATH}/pids || ERROR_AND_EXIT "Failed to create pids"
    
    if [ ${1} == "PROMETHEUS" -o ${1} == "ALERTMANAGER" ]; then
        cd $(dirname ${executable_file})
    fi
   
    eval ${command}
    echo $! > $pid_file
    cd ${ROOT_PATH}
    INFO "DONE"
}

# args: <pid file>
function stop_by_pid_file {
  local pid_file=${1}

  if is_process_running ${pid_file}; then
      local pid=$(cat ${pid_file})
      INFO "PID info is ${pid}"
      kill -s TERM $pid
  else
      INFO "No such process"
  fi
}

function status_daemon {
  local daemonvarname="${1}_DAEMON_NAME"
  local daemon_name="${!daemonvarname}"
  
  local pidpathname="${1}_PID_FILE"
  local pid_file="${!pidpathname}"

  if is_process_running ${pid_file}; then
    local pid=$(cat ${pid_file})
    INFO "${daemon_name} is running, pid is ${pid}"
  else
    ERROR "${daemon_name} status is: Exited"
  fi

}

function stop_daemon {
  local daemonvarname="${1}_DAEMON_NAME"
  local daemon_name="${!daemonvarname}"
  
  local pidpathname="${1}_PID_FILE"

  local pid_file="${!pidpathname}"
  
  INFO "Stopping ${daemon_name}"

  stop_by_pid_file ${pid_file}

  INFO "Done"
}

function wait_daemon_to_exit {
  local exepathname="${1}_BIN_PATH"
  local executable_file="${!exepathname}"   
  local pidpathname="${1}_PID_FILE"
  local pid_file="${!pidpathname}"
  [[ -e ${executable_file} ]] || ERROR_AND_EXIT "${executable_file} not found"
  wait_for_exit ${pid_file}
}

function restart_daemon {
  stop_daemon $@
  wait_daemon_to_exit $@
  start_daemon $@
}

for DAEMON in ${TARGETS[@]}
do
    case ${ACTION} in
        start)
            start_daemon ${DAEMON}
            ;;
        stop)
            stop_daemon ${DAEMON}
            ;;
        restart)
            restart_daemon ${DAEMON}
            ;;
        status)
            status_daemon ${DAEMON}
            ;;
    esac
done