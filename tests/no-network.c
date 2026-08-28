#include <errno.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <unistd.h>

static void deny_network(void) {
    static const char message[] = "network syscall attempted\n";
    write(STDERR_FILENO, message, sizeof(message) - 1);
    _exit(97);
}

int socket(int domain, int type, int protocol) {
    (void)domain;
    (void)type;
    (void)protocol;
    deny_network();
    errno = EPERM;
    return -1;
}

int connect(int socket_fd, const struct sockaddr *address, socklen_t address_length) {
    (void)socket_fd;
    (void)address;
    (void)address_length;
    deny_network();
    errno = EPERM;
    return -1;
}

ssize_t sendto(int socket_fd, const void *buffer, size_t length, int flags,
               const struct sockaddr *destination, socklen_t destination_length) {
    (void)socket_fd;
    (void)buffer;
    (void)length;
    (void)flags;
    (void)destination;
    (void)destination_length;
    deny_network();
    errno = EPERM;
    return -1;
}
