#pragma once

typedef void * acl_t;
typedef void * acl_entry_t;
typedef enum {
    ACL_TYPE_EXTENDED
} acl_type_t;

static const int ACL_FIRST_ENTRY = -1;
static const int ACL_NEXT_ENTRY = -2;

acl_t
     acl_get_file(const char *path_p, acl_type_t type);
int
     acl_get_entry(acl_t acl, int entry_id, acl_entry_t *entry_p);
int
     acl_free(void *obj_p);
