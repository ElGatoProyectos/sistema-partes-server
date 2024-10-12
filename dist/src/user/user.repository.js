"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    findAll(skip, limit, filters, user) { }
    findById(user_id) { }
    createUser(data) { }
    updateUser(data, user_id) { }
    updateStatusUser(user_id) { }
    updateRolUser(user_id, rol_id) { }
    getUsersForCompany(skip, data, rol, user_id) { }
    findByDni(dni) { }
    existsEmail(dni) { }
    searchNameUser(name, skip, limit) { }
    assignUserPermissions(data) { }
}
exports.UserRepository = UserRepository;
