var names = [
    "signal",
    "raise",
    "pipe",
    "dup",
    "dup2",
    "execv",
    "execl",
    "execvp",
    "execlp",
    "getpwnam",
    "getpwnam_r",
    "getpwent",
    "tcsetpgrp",
    "kill",
    "killpg",
    "fork",
    "getpid",
    "setpgid",
    "getpgrp",
    "setpgrp",
    "issetugid",
    "strsignal",
    "wait4",
    "waitpid",
    "sigsuspend",
    "getuid",
    "geteuid",
    "getgid",
    "getegid",
    "umask",
    "getrlimit",
    "setrlimit",
    "sigaction",
    "sigfillset",
    "sigprocmask",
    "sigsetmask",
    "siginterrupt",
    "sigaltstack",
    "getppid",
    "tcgetpgrp",
    "gethostname",
    "tzset",
    "flockfile",
    "ftrylockfile",
    "funlockfile",
    "getpwuid",
    "getpwuid_r",
    "setpwent",
    "endpwent",
    "getgrgid",
    "setreuid",
    "setregid",
    "strmode",
    "acl_get_file",
    "acl_free",
    "acl_get_entry",
    "fchdir",
    "chown",
    "fchown",
    "lchown",
    "fchownat",
    "chmod",
    "fchmod",
    "fchmodat",
    "lchmod",
    "futimes",
    "utimes",
    "system",
    "mkstemp",
    "mkstemps",
    "mkostemp",
    "mkostemps",
    "tmpfile",
    "settimeofday",
    "bsd_signal",
    "ttyname",
    "dlclose",
    "ctermid_r",
    "socket",
    "connect",
    "popen",
    "pclose",
    "errx",        //???
    "vwarnx",      //???
    // posix
    "posix_spawn",
    "posix_spawnp",
    "posix_spawnattr_init",
    "posix_spawnattr_destroy",
    "posix_spawnattr_setflags",
    "posix_spawnattr_setsigmask",
    "posix_spawn_file_actions_init",
    "posix_spawn_file_actions_destroy",
    "posix_spawn_file_actions_addopen",
    "posix_spawn_file_actions_addclose",
    "posix_spawn_file_actions_adddup2",
    // pthreads
    "pthread_mutex_init",
    "pthread_mutex_lock",
    "pthread_cond_timedwait",
    "pthread_cond_signal",
    "pthread_mutex_unlock",
    "pthread_cond_destroy",
    "pthread_mutex_destroy", 
    "pthread_cond_wait",
    "pthread_cond_init",
    "pthread_attr_init",
    "pthread_attr_setstacksize",
    "pthread_attr_destroy",
    "pthread_create",
    "pthread_detach",
    "pthread_self",
    "pthread_exit",
    "pthread_mutex_trylock",
    "pthread_key_create",
    "pthread_key_delete",
    "pthread_setspecific",
    "pthread_getspecific",
    // curses (terminfo)
    "tgetent",
    "tgetflag",
    "tgetnum",
    "tgetstr",
    "tgoto",
    "tputs",
    // termios
    "cfgetospeed",
    "cfgetispeed",
    "cfsetospeed",
    "cfsetispeed",
    "tcsendbreak",
    "tcdrain",
    "tcflush",
    "tcflow",
    "tcgetsid"
]

const stubs: {
    debug: (message: string) => void,
    [key: string]: (...args: any[]) => void
} = {
    debug: (message) => {}
};
for (let nm of names) {
    stubs[nm] = function() {
        stubs.debug(`stub for ${nm} [${[...arguments]}]`);
    }
}

export default stubs
