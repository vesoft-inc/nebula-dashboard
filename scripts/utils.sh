ED=
GREEN=
YELLOW=
BLUE=
BLINK=
NC=

# To detect if stdout or stderr is being attached to terminal
function is_tty {
    [[ -t 1 ]] && [[ -t 2 ]]
        return $?
}

# Enable colorful output only if no terminal attached
is_tty && RED=$(echo -e "\001\033[1;31m\002")
is_tty && GREEN=$(echo -e "\001\033[1;32m\002")
is_tty && YELLOW=$(echo -e "\001\033[1;33m\002")
is_tty && BLUE=$(echo -e "\001\033[1;34m\002")
is_tty && BLINK=$(echo -e "\001\033[5m\002")
is_tty && NC=$(echo -e "\001\033[0m\002")

function INFO {
    echo "${GREEN}[INFO]${NC}" $@
}


function WARN {
    echo "${YELLOW}[WARN]${NC}" $@
}

function ERROR {
    echo "${RED}[ERROR]${NC}" $@ >&2
}

function ERROR_AND_EXIT {
    ERROR $@
    exit 1
}

function is_process_running {
    local pid_file=${1}
    
    [[ -f ${pid_file} ]] || return 1

    local pid=$(cat ${pid_file})
    [[ -z ${pid} ]] && return 1
     ps -p ${pid} &>/dev/null
    return $?
}

function make_log_dir_if_absent {
  [[ -d ${1} ]] || mkdir -p ${1} >/dev/null
}

function make_pid_dir_if_absent {
  [[ -d ${1} ]] || mkdir -p ${1} >/dev/null
}

# To wait for a process to exit
# args: <path to pid file> <seconds to wait>
function wait_for_exit {
    local pid_file=${1}
    local seconds=${2}
    is_process_running ${pid_file} || return 0
    while [[ ${seconds} > 0 ]]; do
        sleep 0.1
        is_process_running ${pid_file} || return 0
        seconds=$(echo "${seconds} - 0.1" | bc -l)
    done
}