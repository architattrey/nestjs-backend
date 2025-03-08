import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class AssignRolesDto {
    // The 'roleIds' field will be validated using the class-validator decorators
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    roleIds: number[];// This is the field that will hold an array of role IDs that will be assigned to a user
}
